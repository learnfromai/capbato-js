import db from '../config/db.js'

export function getPatients(req, res) {
  const sql = `
          SELECT 
              PatientID AS patient_id, 
              LastName AS last_name, 
              FirstName AS first_name, 
              MiddleName AS middle_name, 
              DATE_FORMAT(DateOfBirth, '%Y-%m-%d') AS date_of_birth 
          FROM patients
      `
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json(result)
    }
  })
}

export function addPatient(req, res) {
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
  } = req.body

  const sql = `
        INSERT INTO patients 
        (LastName, FirstName, MiddleName, DateOfBirth, Age, Gender, ContactNumber, 
        MaritalStatus, Occupation, Weight, Height, Address, 
        GLastName, GFirstName, GMiddleName, GDateofBirth, GAge, GContactNumber, GRelationship, GAddress) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

  db.query(
    sql,
    [
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
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting patient:', err)
        res.status(500).json({ error: 'Failed to add patient' })
      } else {
        console.log('✅ New patient added successfully!')
        res.json({
          message: 'Patient added successfully!',
          patient_id: result.insertId,
        })
      }
    },
  )
}
