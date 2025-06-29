import db from '../config/db.js';

export function getDoctors(req, res) {
  const query = `SELECT DoctorID, FirstName, LastName, Specialization, ContactNumber FROM doctors`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
}
