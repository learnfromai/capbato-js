const db = require("../config/db");

// ✅ Get all appointments
exports.getAppointments = (req, res) => {
    db.query("SELECT * FROM appointments", (err, results) => {
        if (err) {
            console.error("🔴 Error fetching appointments:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json(results);
    });
};

// ✅ Add a new appointment
exports.addAppointment = (req, res) => {
    const { patient_name, visit_type, appointment_date, appointment_time, status } = req.body;  // ✅ Match frontend

    if (!patient_name || !visit_type || !appointment_date || !appointment_time || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO appointments (patient_name, visit_type, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [patient_name, visit_type, appointment_date, appointment_time, status], (err, result) => {
        if (err) {
            console.error("🔴 Error adding appointment:", err);
            return res.status(500).json({ error: "Failed to insert appointment" });
        }
        res.status(201).json({ message: "✅ Appointment added successfully!", id: result.insertId });
    });
};
