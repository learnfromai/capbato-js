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
            document.getElementById("patientID").textContent = data.PatientID || "N/A";
            document.getElementById("fullName").textContent = `${(data.FirstName || "N/A")} ${(data.MiddleName || "")} ${(data.LastName || "N/A")}`.toUpperCase();
            document.getElementById("gender").textContent = (data.Gender || "N/A").toUpperCase();
            document.getElementById("age").textContent = data.Age || "N/A";
            document.getElementById("dob").textContent = data.DateOfBirth || "N/A";
            document.getElementById("contact").textContent = data.ContactNumber || "N/A";
            document.getElementById("address").textContent = (data.Address || "N/A").toUpperCase();
            document.getElementById("maritalStatus").textContent = (data.MaritalStatus || "N/A").toUpperCase();
            document.getElementById("occupation").textContent = (data.Occupation || "N/A").toUpperCase();
            document.getElementById("weight").textContent = (data.Weight || "N/A") + " kg";
            document.getElementById("height").textContent = (data.Height || "N/A") + " cm";

            document.getElementById("guardianFullName").textContent = `${(data.GFirstName || "N/A")} ${(data.GMiddleName || "")} ${(data.GLastName || "N/A")}`.toUpperCase();
            document.getElementById("guardianDOB").textContent = data.GDateOfBirth || "N/A";
            document.getElementById("guardianAge").textContent = data.GAge || "N/A";
            document.getElementById("guardianContact").textContent = data.GContactNumber || "N/A";
            document.getElementById("guardianRelationship").textContent = (data.GRelationship || "N/A").toUpperCase();
            document.getElementById("guardianAddress").textContent = (data.GAddress || "N/A").toUpperCase();

            document.getElementById("medicalHistory").textContent = (data.MedicalHistory || "No medical history available.").toUpperCase();
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

document.getElementById("patientbtn").addEventListener("click", function () {
    window.location.href = "patients.html";
  });
  
  document.getElementById("dashboardbtn").addEventListener("click", function () {
    window.location.href = "index.html";
  });
  
  document.getElementById("appointmentbtn").addEventListener("click", function () {
    window.location.href = "appointments.html";
  });