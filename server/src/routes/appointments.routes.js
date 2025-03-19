import express from "express";
import db from "../config/db.js"; // Ensure your db file has the correct extension

const router = express.Router();

// ✅ Route to Fetch All Appointments
router.get("/", (req, res) => {
    db.query("SELECT * FROM appointments ORDER BY id DESC", (err, results) => {
        if (err) {
            console.error("🔴 Error fetching appointments:", err);
            return res.status(500).json({ error: "Database error." });
        }
        res.json(results);
    });
});

// ✅ Route to Add an Appointment
router.post("/add", (req, res) => {
    const { patient_name, visit_type, appointment_date, appointment_time } = req.body;
const status = "Confirmed"; // ✅ Automatically set status to "Confirmed"

if (!patient_name || !visit_type || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: "All fields are required!" });
}


    const sql = "INSERT INTO appointments (patient_name, visit_type, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [patient_name, visit_type, appointment_date, appointment_time, status], (err, result) => {
        if (err) {
            console.error("🔴 Error inserting appointment:", err);
            return res.status(500).json({ error: "Failed to add appointment." });
        }
        res.json({ message: "Appointment added successfully!", id: result.insertId });
    });
});

export default router;

router.put("/cancel/:id", (req, res) => {
    const appointmentId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status is required." });
    }

    const sql = "UPDATE appointments SET status = ? WHERE id = ?";
    db.query(sql, [status, appointmentId], (err, result) => {
        if (err) {
            console.error("🔴 Error updating appointment:", err);
            return res.status(500).json({ error: "Failed to update appointment status." });
        }
        res.json({ message: "Appointment cancelled successfully!" });
    });
});
