import db from '../config/db.js';

export function getPatientById(req, res) {
  const patientId = req.params.id;

  const sql = `
    SELECT 
      PatientID, FirstName, MiddleName, LastName, Gender, Age, DateOfBirth,
      ContactNumber, Address,
      GuardianName, GuardianGender, GuardianRelationship, GuardianContactNumber, GuardianAddress
    FROM patients
    WHERE PatientID = ?
  `;

  db.query(sql, [patientId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient = result[0];

    for (const key in patient) {
      if (typeof patient[key] === 'string') {
        patient[key] = patient[key].toUpperCase();
      }
    }

    res.json(patient);
  });
}

export function getPatients(req, res) {
  const sql = `
    SELECT 
      PatientID AS patient_id, 
      CONCAT(UPPER(FirstName), ' ', 
             IFNULL(CONCAT(UPPER(MiddleName), ' '), ''), 
             UPPER(LastName)) AS full_name,
      UPPER(LastName) AS last_name,
      DATE_FORMAT(DateOfBirth, '%Y-%m-%d') AS date_of_birth 
    FROM patients
    ORDER BY last_name ASC;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result);
    }
  });
}

export function addPatient(req, res) {
  console.log("🟡 Backend Received Data:", req.body);

  const {
    lastname,
    firstname,
    middlename,
    dob,
    age,
    gender,
    contact,
    address,

    guardian_name,
    guardian_gender,
    guardian_relationship,
    guardian_contact,
    guardian_address
  } = req.body;

  const firstLetter = (lastname || '')[0].toUpperCase();

  const countSql = `
    SELECT COUNT(*) AS count
    FROM patients
    WHERE PatientID LIKE '${firstLetter}%'
  `;

  db.query(countSql, (err, countResult) => {
    if (err) {
      console.error("🔴 Error generating PatientID:", err);
      return res.status(500).json({ error: "Failed to generate PatientID" });
    }

    const count = countResult[0].count + 1;
    const patientId = `${firstLetter}${count}`;

    const patientData = [
      patientId,
      (lastname || '').toUpperCase(),
      (firstname || '').toUpperCase(),
      (middlename || '').toUpperCase(),
      dob,
      age,
      (gender || '').toUpperCase(),
      contact,
      (address || '').toUpperCase(),
      (guardian_name || '').toUpperCase(),
      (guardian_gender || '').toUpperCase(),
      (guardian_relationship || '').toUpperCase(),
      guardian_contact,
      (guardian_address || '').toUpperCase()
    ];

    const sql = `
      INSERT INTO patients 
      (PatientID, LastName, FirstName, MiddleName, DateOfBirth, Age, Gender, ContactNumber, Address,
       GuardianName, GuardianGender, GuardianRelationship, GuardianContactNumber, GuardianAddress) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, patientData, (err, result) => {
      if (err) {
        console.error("🔴 Error inserting patient:", err);
        return res.status(500).json({ error: "Failed to add patient", details: err });
      } else {
        console.log("✅ New patient added successfully!");
        res.json({ message: "Patient added successfully!", patient_id: patientId });
      }
    });
  });
}
