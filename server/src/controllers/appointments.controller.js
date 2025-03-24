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
      console.error('🔴 Error fetching appointments:', err)
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

  // ✅ Check if there are already 4 appointments at that time and date
  const checkQuery = `
    SELECT COUNT(*) AS count
    FROM appointments
    WHERE appointment_date = ? AND appointment_time = ?
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
  const { patient_name, reason_for_visit, appointment_date, appointment_time } = req.body;

  const sql = `
    UPDATE appointments 
    SET patient_name = ?, reason_for_visit = ?, appointment_date = ?, appointment_time = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [patient_name, reason_for_visit, appointment_date, appointment_time, appointmentId],
    (err, result) => {
      if (err) {
        console.error('Error updating appointment:', err);
        return res.status(500).json({ error: 'Failed to update appointment' });
      }
      res.json({ message: 'Appointment updated successfully!' });
    }
  );
}

export async function cancelAppointment(req, res) {
  const appointmentId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  const sql = 'UPDATE appointments SET status = ? WHERE id = ?';
  db.query(sql, [status, appointmentId], (err, result) => {
    if (err) {
      console.error('Error updating appointment:', err);
      return res.status(500).json({ error: 'Failed to update appointment status.' });
    }
    res.json({ message: 'Appointment cancelled successfully!' });
  });
}
