import db from '../config/db.js'

// ✅ Get all appointments
export async function getAppointments(req, res) {
  const query = `
		SELECT 
		id,
		patient_name,
    visit_type,
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

// ✅ Add a new appointment
export async function addAppointment(req, res) {
  const { patient_name, visit_type, appointment_date, appointment_time } =
    req.body
  const status = 'Confirmed' // ✅ Automatically set status to "Confirmed"

  if (!patient_name || !visit_type || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const sql =
    'INSERT INTO appointments (patient_name, visit_type, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)'
  db.query(
    sql,
    [patient_name, visit_type, appointment_date, appointment_time, status],
    (err, result) => {
      if (err) {
        console.error('🔴 Error adding appointment:', err)
        return res.status(500).json({ error: 'Failed to insert appointment' })
      }
      res.status(201).json({
        message: '✅ Appointment added successfully!',
        id: result.insertId,
      })
    },
  )
}

export async function cancelAppointment(req, res) {
  const appointmentId = req.params.id
  const { status } = req.body

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' })
  }

  const sql = 'UPDATE appointments SET status = ? WHERE id = ?'
  // eslint-disable-next-line no-unused-vars
  db.query(sql, [status, appointmentId], (err, result) => {
    if (err) {
      console.error('🔴 Error updating appointment:', err)
      return res
        .status(500)
        .json({ error: 'Failed to update appointment status.' })
    }
    res.json({ message: '✅ Appointment cancelled successfully!' })
  })
}
