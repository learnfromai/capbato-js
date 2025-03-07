import db from '../config/db.js';

// ✅ Fetch all appointments from the database
export function getAppointments(req, res) {
    const sql = `SELECT id, patient_name, visit_type, DATE_FORMAT(appointment_date, '%Y-%m-%d') AS date, 
                        TIME_FORMAT(appointment_time, '%h:%i %p') AS time, status 
                 FROM appointments ORDER BY appointment_date DESC`;

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
}
