const db = require('../db'); // Adjust if you're using a different DB file/module

exports.saveBloodChemistry = async (req, res) => {
  const { patient_id, patient_name, date, age, sex, results } = req.body;

  try {
    const query = `
      INSERT INTO laboratory_results (
        patient_id, patient_name, date, age, sex, results
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      patient_id,
      patient_name,
      date,
      age,
      sex,
      JSON.stringify(results), // Store results as JSON
    ];

    await db.query(query, values); // Or db.execute / db.pool.query depending on your setup

    res.status(201).json({ message: 'Blood chemistry results saved successfully' });
  } catch (error) {
    console.error('Error saving lab result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
