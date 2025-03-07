import db from '../config/db.js';

// Get patient details by ID
export function getPatientById(req, res) {
    const patientId = req.params.id;

    const sql = `SELECT * FROM patients WHERE PatientID = ?`;

    db.query(sql, [patientId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Convert patient details to uppercase before sending response
        const patient = result[0];
        for (const key in patient) {
            if (typeof patient[key] === 'string') {
                patient[key] = patient[key].toUpperCase();
            }
        }

        res.json(patient);
    });
}

// Get all patients
export function getPatients(req, res) {
    const sql = `
        SELECT 
            PatientID AS patient_id, 
            UPPER(LastName) AS last_name, 
            UPPER(FirstName) AS first_name, 
            UPPER(MiddleName) AS middle_name, 
            DATE_FORMAT(DateOfBirth, '%Y-%m-%d') AS date_of_birth 
        FROM patients
    `;

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
}

// Add new patient with uppercase conversion
export function addPatient(req, res) {
    console.log("🟡 Backend Received Data:", req.body); // Debugging log

    const {
        lastname,
        firstname,
        middlename,
        dob,
        age,
        gender,
        contact,
        marital_status,
        occupation,
        weight,
        height,
        address,
        r_lastname,
        r_firstname,
        r_middlename,
        r_dob,
        r_age,
        r_contact,
        relationship,
        r_address,
    } = req.body;

    // Convert all string values to uppercase before saving
    const patientData = [
        lastname.toUpperCase(),
        firstname.toUpperCase(),
        middlename ? middlename.toUpperCase() : '',
        dob,
        age,
        gender.toUpperCase(),
        contact,
        marital_status.toUpperCase(),
        occupation.toUpperCase(),
        weight,
        height,
        address.toUpperCase(),
        r_lastname.toUpperCase(),
        r_firstname.toUpperCase(),
        r_middlename ? r_middlename.toUpperCase() : '',
        r_dob,
        r_age,
        r_contact,
        relationship.toUpperCase(),
        r_address.toUpperCase(),
    ];

    const sql = `
        INSERT INTO patients 
        (LastName, FirstName, MiddleName, DateOfBirth, Age, Gender, ContactNumber, 
        MaritalStatus, Occupation, Weight, Height, Address, 
        GLastName, GFirstName, GMiddleName, GDateofBirth, GAge, GContactNumber, GRelationship, GAddress) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, patientData, (err, result) => {
        if (err) {
            console.error("🔴 Error inserting patient:", err);
            res.status(500).json({ error: "Failed to add patient" });
        } else {
            console.log("✅ New patient added successfully!");
            res.json({ message: "Patient added successfully!", patient_id: result.insertId });
        }
    });
}
