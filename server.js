const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  // Change if needed
    password: "",  // Change if you set a password
    database: "mysql" // Replace with your actual database name
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// API to fetch patients
app.get("/patients", (req, res) => {
    const sql = `
        SELECT 
            PatientID AS patient_id, 
            LastName AS last_name, 
            FirstName AS first_name, 
            MiddleName AS middle_name, 
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
});



app.get("/", (req, res) => {
    res.send("Welcome to the Clinic Management System API!");
});

app.post("/add-patient", (req, res) => {
    const {
        lastname, firstname, middlename, dob, age, gender, contact,
        marital_status, occupation, weight, height, address,
        r_lastname, r_firstname, r_middlename, r_dob, r_age, r_contact, relationship, r_address
    } = req.body;

    const sql = `
        INSERT INTO patients 
        (LastName, FirstName, MiddleName, DateOfBirth, Age, Gender, ContactNumber, 
        MaritalStatus, Occupation, Weight, Height, Address, 
        GLastName, GFirstName, GMiddleName, GDateofBirth, GAge, GContactNumber, GRelationship, GAddress) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, 
        [lastname, firstname, middlename, dob, age, gender, contact,
        marital_status, occupation, weight, height, address,
        r_lastname, r_firstname, r_middlename, r_dob, r_age, r_contact, relationship, r_address], 
        (err, result) => {
            if (err) {
                console.error("Error inserting patient:", err);
                res.status(500).json({ error: "Failed to add patient" });
            } else {
                console.log("✅ New patient added successfully!");
                res.json({ message: "Patient added successfully!", patient_id: result.insertId });
            }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
