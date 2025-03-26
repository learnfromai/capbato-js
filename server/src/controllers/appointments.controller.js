import db from '../config/db.js'

export async function getAppointments(req, res) {
  const query = `
    SELECT 
    id,
    patient_name,
    reason_for_visit,
    DATE_FORMAT(appointment_date, '%Y-%m-%d') AS appointment_date,
    appointment_time,
    status,
    created_at
    FROM appointments;
  `

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err)
      return res.status(500).json({ error: 'Database error' })
    }
    res.status(200).json(results)
  })
}

export async function addAppointment(req, res) {
  const { patient_name, reason_for_visit, appointment_date, appointment_time } = req.body;
  const status = 'Confirmed';

  if (!patient_name || !reason_for_visit || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'All fields are required' });
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
    if (count >= 4) {
      return res.status(400).json({ error: 'This time slot is already fully booked.' });
    }

    const insertQuery = `
      INSERT INTO appointments (patient_name, reason_for_visit, appointment_date, appointment_time, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [patient_name, reason_for_visit, appointment_date, appointment_time, status],
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
}

export async function updateAppointment(req, res) {
  const appointmentId = req.params.id;
  const { patient_name, reason_for_visit, appointment_date, appointment_time, status } = req.body;

  if (!patient_name || !reason_for_visit || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'All fields are required' });
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
      SET patient_name = ?, reason_for_visit = ?, appointment_date = ?, appointment_time = ?, status = ?
      WHERE id = ?
    `;

    db.query(updateQuery, [patient_name, reason_for_visit, appointment_date, appointment_time, status, appointmentId], (updateErr, result) => {
      if (updateErr) {
        console.error('Error updating appointment:', updateErr);
        return res.status(500).json({ error: 'Failed to update appointment' });
      }

      res.status(200).json({ message: 'Appointment updated successfully!' });
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
        db.query(updateQuery, [status, appointmentId], (updateErr, result) => {
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
    db.query(updateQuery, [status, appointmentId], (err, result) => {
      if (err) {
        console.error('Error updating appointment status:', err);
        return res.status(500).json({ error: 'Failed to update appointment status.' });
      }
      res.json({ message: 'Appointment cancelled successfully!' });
    });
  }
}
