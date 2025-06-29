import db from '../config/db.js';

export async function getAppointments(req, res) {
  const query = `
  SELECT 
    appointments.id,
    appointments.patient_id,
    CONCAT(patients.LastName, ', ', patients.FirstName, ' ', COALESCE(patients.MiddleName, '')) AS patient_name,
    appointments.reason_for_visit,
    DATE_FORMAT(appointments.appointment_date, '%Y-%m-%d') AS appointment_date,
    appointments.appointment_time,
    appointments.status,
    appointments.doctor_name
  FROM appointments
  JOIN patients ON appointments.patient_id = patients.PatientID
`;


  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
}

export function getAppointmentsByPatientId(req, res) {
  const patientId = req.params.id;
  const sql = `
    SELECT 
      id, reason_for_visit, appointment_date, appointment_time, status
    FROM appointments
    WHERE patient_id = ?
    ORDER BY appointment_date DESC, appointment_time DESC
  `;

  db.query(sql, [patientId], (err, result) => {
    if (err) {
      console.error('Error fetching appointments by patient ID:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(result);
  });
}

export async function addAppointment(req, res) {
  console.log("Received POST /appointments/add with:", req.body);

  const {
    patient_id = '',
    patient_name,
    reason_for_visit,
    appointment_date,
    appointment_time,
    doctor_name,
    status // ← ✅ add this line
  } = req.body;



  if (!patient_name || !reason_for_visit || !appointment_date || !appointment_time || !patient_id) {
    return res.status(400).json({ error: 'All fields including valid patient ID are required' });
  }

  const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
  const now = new Date();
  if (appointmentDateTime < now) {
    return res.status(400).json({ error: 'Cannot book a past time slot.' });
  }

  const verifyPatientQuery = `SELECT ContactNumber FROM patients WHERE PatientID = ? LIMIT 1`;

  db.query(verifyPatientQuery, [patient_id], (err, result) => {
    if (err) {
      console.error('Error verifying patient ID:', err);
      return res.status(500).json({ error: 'Error checking patient existence' });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: 'Patient does not exist in the database.' });
    }

    const contact_number = result[0].ContactNumber || result[0].contact_number || '';

    const duplicateCheckQuery = `
      SELECT COUNT(*) AS count
      FROM appointments
      WHERE patient_id = ? AND appointment_date = ? AND status = 'Confirmed'
    `;

    db.query(duplicateCheckQuery, [patient_id, appointment_date], (dupErr, dupResults) => {
      if (dupErr) {
        console.error('Error checking for existing appointment:', dupErr);
        return res.status(500).json({ error: 'Database error' });
      }

      if (dupResults[0].count > 0) {
        return res.status(400).json({ error: 'This patient already has an appointment for that day.' });
      }

      const checkQuery = `
        SELECT COUNT(*) AS count
        FROM appointments
        WHERE appointment_date = ? AND appointment_time = ? AND status = 'Confirmed'
      `;

      db.query(checkQuery, [appointment_date, appointment_time], (err, results) => {
        if (err) {
          console.error('Error checking time availability:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        const count = results[0].count;
        if (count >= 1) {
          return res.status(400).json({ error: 'This time slot is already booked.' });
        }

        const insertQuery = `
          INSERT INTO appointments (patient_id, patient_name, reason_for_visit, appointment_date, appointment_time, status, contact_number, doctor_name)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;


        db.query(
          insertQuery,
          [patient_id, patient_name, reason_for_visit, appointment_date, appointment_time, status, contact_number, doctor_name],
          (insertErr, result) => {
            if (insertErr) {
              console.error('Error adding appointment:', insertErr);
              return res.status(500).json({ error: 'Failed to insert appointment' });
            }

            res.status(201).json({
              message: 'Appointment added successfully!',
              id: result.insertId,
            });
          }
        );
      });
    });
  });
}

export async function updateAppointment(req, res) {
  const appointmentId = req.params.id;
  const {
    patient_id = '',
    patient_name,
    reason_for_visit,
    appointment_date,
    appointment_time,
    status,
    doctor_name
  } = req.body;


  if (!patient_name || !reason_for_visit || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const getPatientQuery = `
    SELECT ContactNumber
    FROM patients
    WHERE PatientID = ?
    LIMIT 1
  `;

  db.query(getPatientQuery, [patient_id], (err, patientResult) => {
    if (err) {
      console.error('Error fetching patient contact (update):', err);
      return res.status(500).json({ error: 'Database error while fetching contact' });
    }

    const contact_number = patientResult.length > 0 ? patientResult[0].ContactNumber : '';

    const duplicateCheckQuery = `
      SELECT COUNT(*) AS count
      FROM appointments
      WHERE patient_id = ? AND appointment_date = ? AND id != ? AND status = 'Confirmed'
    `;

    db.query(duplicateCheckQuery, [patient_id, appointment_date, appointmentId], (dupErr, dupResults) => {
      if (dupErr) {
        console.error('Error checking for duplicate during update:', dupErr);
        return res.status(500).json({ error: 'Database error during duplicate check' });
      }

      if (dupResults[0].count > 0) {
        return res.status(400).json({ error: 'This patient already has another appointment on the same day.' });
      }

      const checkQuery = `
        SELECT COUNT(*) AS count
        FROM appointments
        WHERE appointment_date = ? AND appointment_time = ? AND id != ? AND status = 'Confirmed'
      `;

      db.query(checkQuery, [appointment_date, appointment_time, appointmentId], (err, results) => {
        if (err) {
          console.error('Error checking time availability during update:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        const count = results[0].count;

        if (count >= 4) {
          return res.status(400).json({ error: 'This time slot is already fully booked.' });
        }

        const updateQuery = `
          UPDATE appointments 
          SET patient_id = ?, patient_name = ?, reason_for_visit = ?, appointment_date = ?, appointment_time = ?, status = ?, contact_number = ?, doctor_name = ?
          WHERE id = ?
        `;


        db.query(updateQuery, [
        patient_id,
        patient_name,
        reason_for_visit,
        appointment_date,
        appointment_time,
        status,
        contact_number,
        doctor_name,
        appointmentId,
      ], (updateErr) => {
          if (updateErr) {
            console.error('Error updating appointment:', updateErr);
            return res.status(500).json({ error: 'Failed to update appointment' });
          }

          res.status(200).json({ message: 'Appointment updated successfully!' });
        });
      });
    });
  });
}

export async function cancelAppointment(req, res) {
  const appointmentId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  if (status === "Confirmed") {
    const getDetailsQuery = 'SELECT appointment_date, appointment_time FROM appointments WHERE id = ?';
    db.query(getDetailsQuery, [appointmentId], (err, results) => {
      if (err || results.length === 0) {
        console.error('Error fetching appointment details:', err);
        return res.status(500).json({ error: 'Failed to fetch appointment details.' });
      }

      const { appointment_date, appointment_time } = results[0];
      const checkQuery = `
        SELECT COUNT(*) AS count
        FROM appointments
        WHERE appointment_date = ? AND appointment_time = ? AND status = 'Confirmed'
      `;

      db.query(checkQuery, [appointment_date, appointment_time], (countErr, countResults) => {
        if (countErr) {
          console.error('Error checking confirmed count:', countErr);
          return res.status(500).json({ error: 'Database error while checking availability.' });
        }

        const confirmedCount = countResults[0].count;
        if (confirmedCount >= 4) {
          return res.status(400).json({ error: 'This time slot is already fully booked. Please choose another.' });
        }

        const updateQuery = 'UPDATE appointments SET status = ? WHERE id = ?';
        db.query(updateQuery, [status, appointmentId], (updateErr) => {
          if (updateErr) {
            console.error('Error updating appointment status:', updateErr);
            return res.status(500).json({ error: 'Failed to update appointment status.' });
          }

          res.json({ message: 'Appointment reconfirmed successfully!' });
        });
      });
    });
  } else {
    const updateQuery = 'UPDATE appointments SET status = ? WHERE id = ?';
    db.query(updateQuery, [status, appointmentId], (err) => {
      if (err) {
        console.error('Error updating appointment status:', err);
        return res.status(500).json({ error: 'Failed to update appointment status.' });
      }
      res.json({ message: 'Appointment cancelled successfully!' });
    });
  }
}

export function getTodayConfirmedAppointments(req, res) {
  const sql = `
    SELECT COUNT(*) AS total 
    FROM appointments 
    WHERE DATE(appointment_date) = CURDATE() AND status = 'Confirmed'
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }

    res.json({ total: result[0].total });
  });
}

export function getTodayAppointments(req, res) {
  const sql = `
    SELECT 
      appointments.patient_id, 
      appointments.patient_name, 
      appointments.reason_for_visit, 
      appointments.contact_number, 
      appointments.appointment_time, 
      appointments.status,
      appointments.doctor_name
    FROM appointments
    WHERE DATE(appointments.appointment_date) = CURDATE() AND appointments.status = 'Confirmed'
    ORDER BY appointments.appointment_time ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching today's appointments:", err);
      return res.status(500).json({ error: 'Database error', details: err });
    }

    res.json(result);
  });
}


export function getWeeklyAppointmentSummary(req, res) {
  const sql = `
    SELECT appointment_date AS date, COUNT(*) AS count
    FROM appointments
    WHERE status = 'Confirmed'
      AND appointment_date >= CURDATE() - INTERVAL 6 DAY
    GROUP BY appointment_date
    ORDER BY appointment_date
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching weekly summary:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }

    res.status(200).json(results);
  });
}

