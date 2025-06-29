import db from '../config/db.js'; // ✅ ESM-compatible import

// ✅ Save Lab Request Form
export const saveLabRequestForm = async (req, res) => {
  const {
    patient_id,
    patient_name,
    age_gender,
    request_date,
    others,
    cbc_with_platelet = '',
    pregnancy_test = '',
    urinalysis = '',
    fecalysis = '',
    occult_blood_test = '',
    hepa_b_screening = '',
    hepa_a_screening = '',
    hepatitis_profile = '',
    vdrl_rpr = '',
    dengue_ns1 = '',
    ca_125_cea_psa = '',
    fbs = '',
    bun = '',
    creatinine = '',
    blood_uric_acid = '',
    lipid_profile = '',
    sgot = '',
    sgpt = '',
    alp = '',
    sodium_na = '',
    potassium_k = '',
    hbalc = '',
    ecg = '',
    t3 = '',
    t4 = '',
    ft3 = '',
    ft4 = '',
    tsh = ''
  } = req.body;

  const query = `
    INSERT INTO lab_request_entries (
      patient_id, patient_name, age_gender, request_date, others,
      cbc_with_platelet, pregnancy_test, urinalysis, fecalysis, occult_blood_test,
      hepa_b_screening, hepa_a_screening, hepatitis_profile, vdrl_rpr, dengue_ns1, ca_125_cea_psa,
      fbs, bun, creatinine, blood_uric_acid, lipid_profile,
      sgot, sgpt, alp, sodium_na, potassium_k,
      hbalc, ecg, t3, t4, ft3, ft4, tsh
    ) VALUES (?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    patient_id, patient_name, age_gender, request_date, others,
    cbc_with_platelet, pregnancy_test, urinalysis, fecalysis, occult_blood_test,
    hepa_b_screening, hepa_a_screening, hepatitis_profile, vdrl_rpr, dengue_ns1, ca_125_cea_psa,
    fbs, bun, creatinine, blood_uric_acid, lipid_profile,
    sgot, sgpt, alp, sodium_na, potassium_k,
    hbalc, ecg, t3, t4, ft3, ft4, tsh
  ];

  try {
    console.log("Received lab request data:", req.body);
    await db.query(query, values);
    res.status(201).json({ message: 'Lab request submitted successfully' });
  } catch (error) {
    console.error('❌ Error saving lab request:', error.message);
    res.status(500).json({ message: 'Failed to submit lab request', error: error.message });
  }
};

// ✅ Get All Lab Requests
export const getLabRequests = async (req, res) => {
  try {
    const query = `
      SELECT
        patient_id, id, patient_name, request_date AS date,
        cbc_with_platelet, pregnancy_test, urinalysis, fecalysis, occult_blood_test,
        hepa_b_screening, hepa_a_screening, hepatitis_profile, vdrl_rpr, dengue_ns1, ca_125_cea_psa,
        fbs, bun, creatinine, blood_uric_acid, lipid_profile,
        sgot, sgpt, alp, sodium_na, potassium_k,
        hbalc, ecg, t3, t4, ft3, ft4, tsh,
        'Lab Request' AS test_name, status
      FROM lab_request_entries
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("❌ Error fetching lab requests:", err.message);
        return res.status(500).json({ error: "Failed to fetch lab requests" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ error: "Server failure" });
  }
};

// ✅ Save Blood Chemistry Results
export const saveBloodChemResults = async (req, res) => {
  const {
    patient_name, age, sex, date_taken,
    fbs, bun, creatinine, uric_acid, cholesterol,
    triglycerides, hdl, ldl, vldl, sodium,
    potassium, chloride, calcium, sgot, sgpt,
    rbs, alk_phosphatase, total_protein, albumin,
    globulin, ag_ratio, total_bilirubin, direct_bilirubin,
    indirect_bilirubin, ionised_calcium, magnesium,
    hbalc, ogtt_30min, ogtt_1hr, ogtt_2hr, ppbs_2hr, inor_phosphorus
  } = req.body;

  const sql = `
    INSERT INTO blood_chem (
      patient_name, age, sex, date_taken,
      fbs, bun, creatinine, uric_acid, cholesterol,
      triglycerides, hdl, ldl, vldl, sodium,
      potassium, chloride, calcium, sgot, sgpt,
      rbs, alk_phosphatase, total_protein, albumin,
      globulin, ag_ratio, total_bilirubin, direct_bilirubin,
      indirect_bilirubin, ionised_calcium, magnesium,
      hbalc, ogtt_30min, ogtt_1hr, ogtt_2hr, ppbs_2hr, inor_phosphorus
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    patient_name, age, sex, date_taken,
    fbs, bun, creatinine, uric_acid, cholesterol,
    triglycerides, hdl, ldl, vldl, sodium,
    potassium, chloride, calcium, sgot, sgpt,
    rbs, alk_phosphatase, total_protein, albumin,
    globulin, ag_ratio, total_bilirubin, direct_bilirubin,
    indirect_bilirubin, ionised_calcium, magnesium,
    hbalc, ogtt_30min, ogtt_1hr, ogtt_2hr, ppbs_2hr, inor_phosphorus
  ];

  try {
    console.log("🔬 Saving blood chemistry results:", req.body);
    await db.query(sql, values);
    res.status(201).json({ message: "Blood chemistry results inserted." });
  } catch (err) {
    console.error("❌ DB insert error:", err.message);
    res.status(500).json({ message: "Insert failed", error: err.message });
  }
};

// ✅ Update Lab Request using patient_id + request_date
export const updateLabRequestResults = async (req, res) => {
  const { patientId, requestDate } = req.params;
  const updates = req.body;

  const allowedFields = [
    "fbs", "bun", "creatinine", "blood_uric_acid", "lipid_profile",
    "sgot", "sgpt", "alp", "sodium_na", "potassium_k",
    "hbalc", "ecg", "t3", "t4", "ft3", "ft4", "tsh",
    "status", "date_taken"
  ];

  const updateEntries = Object.entries(updates)
    .filter(([key, value]) => allowedFields.includes(key) && value !== "");

  if (updateEntries.length === 0) {
    return res.status(400).json({ error: "No valid lab fields to update." });
  }

  const fields = updateEntries.map(([key]) => `${key} = ?`).join(", ");
  const values = updateEntries.map(([, value]) => value);

  const sql = `
    UPDATE lab_request_entries
    SET ${fields}
    WHERE patient_id = ? AND request_date = ?
  `;

  try {
    await db.query(sql, [...values, patientId, requestDate]);
    res.status(200).json({ message: "Lab results updated successfully." });
  } catch (error) {
    console.error("❌ Update error:", error.message);
    res.status(500).json({ error: "Failed to update lab request with results" });
  }
};


// ✅ Get Most Recent Lab Request by Patient ID
export const getLabRequestById = (req, res) => {
  const { patientId } = req.params;
  const sql = `
    SELECT * FROM lab_request_entries
    WHERE patient_id = ?
    ORDER BY id DESC
    LIMIT 1
  `;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error("❌ Fetch error:", err.message);
      return res.status(500).json({ error: "Server error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(results[0]);
  });
};
