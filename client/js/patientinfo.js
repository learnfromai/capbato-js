document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("patient_id");
  
    if (!patientId) {
      alert("No patient ID provided!");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/patients/${patientId}`);
      const data = await response.json();
  
      if (response.ok) {
        // Patient Info
        document.getElementById("patientID").textContent = data.PatientID || "N/A";
        document.getElementById("fullName").textContent = `${data.FirstName || ""} ${data.MiddleName || ""} ${data.LastName || ""}`.trim().toUpperCase();
        document.getElementById("gender").textContent = (data.Gender || "N/A").toUpperCase();
        document.getElementById("age").textContent = data.Age || "N/A";
        document.getElementById("dob").textContent = data.DateOfBirth || "N/A";
        document.getElementById("contact").textContent = data.ContactNumber || "N/A";
        document.getElementById("address").textContent = data.Address ? data.Address.toUpperCase() : "N/A";
  
        // Guardian Info
        document.getElementById("guardianFullName").textContent = data.GuardianName ? data.GuardianName.toUpperCase() : "N/A";
        document.getElementById("guardianGender").textContent = (data.GuardianGender || "N/A").toUpperCase();
        document.getElementById("guardianRelationship").textContent = data.GuardianRelationship ? data.GuardianRelationship.toUpperCase() : "N/A";
        document.getElementById("guardianContact").textContent = data.GuardianContactNumber || "N/A";
        document.getElementById("guardianAddress").textContent = data.GuardianAddress ? data.GuardianAddress.toUpperCase() : "N/A";
  
        // Placeholder for future medical history logic
        document.getElementById("medicalHistory").textContent =
          (data.MedicalHistory || "No medical history available.").toUpperCase();
      } else {
        alert("Error: " + (data.error || "Failed to fetch patient data"));
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      alert("An error occurred while retrieving patient details.");
    }
  });
  
  function goBack() {
    window.history.back();
  }
  
  document.getElementById("patientbtn").addEventListener("click", () => {
    window.location.href = "patients.html";
  });
  
  document.getElementById("dashboardbtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
  
  document.getElementById("appointmentbtn").addEventListener("click", () => {
    window.location.href = "appointments.html";
  });
  