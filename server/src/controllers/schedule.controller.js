import db from '../config/db.js';

// GET all schedules
export const getSchedules = (req, res) => {
  const sql = "SELECT id, doctor_name, date, time FROM doctor_schedule ORDER BY date";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// POST new schedule
export const addSchedule = (req, res) => {
  const { doctor, date, time } = req.body;

  if (!doctor || !date || !time) {
    return res.status(400).json({ error: "Missing doctor, date, or time" });
  }

  const sql = "INSERT INTO doctor_schedule (doctor_name, date, time) VALUES (?, ?, ?)";
  db.query(sql, [doctor, date, time], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Schedule added", id: result.insertId });
  });
};

// PUT update schedule
export const updateSchedule = (req, res) => {
  const { id } = req.params;
  const { doctor, date, time } = req.body;

  if (!doctor || !date || !time) {
    return res.status(400).json({ error: "Missing doctor, date, or time" });
  }

  const sql = "UPDATE doctor_schedule SET doctor_name = ?, date = ?, time = ? WHERE id = ?";
  db.query(sql, [doctor, date, time, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Schedule updated" });
  });
};

// DELETE schedule
export const deleteSchedule = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM doctor_schedule WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Schedule deleted" });
  });
};

// Add this function
export const getDoctorForToday = (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const sql = "SELECT doctor_name FROM doctor_schedule WHERE date = ? LIMIT 1";

  db.query(sql, [today], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.json({ doctor_name: "N/A" });
    res.json(results[0]);
  });
};
