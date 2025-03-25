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
      document.getElementById("fullName").textContent = formatName(`${data.FirstName || ""} ${data.MiddleName || ""} ${data.LastName || ""}`);
      document.getElementById("gender").textContent = formatWord(data.Gender || "N/A");
      document.getElementById("age").textContent = data.Age || "N/A";
      document.getElementById("dob").textContent = formatDate(data.DateOfBirth) || "N/A";
      document.getElementById("contact").textContent = data.ContactNumber || "N/A";
      document.getElementById("address").textContent = formatSentence(data.Address) || "N/A";

      document.getElementById("guardianFullName").textContent = formatName(data.GuardianName) || "N/A";
      document.getElementById("guardianGender").textContent = formatWord(data.GuardianGender || "N/A");
      document.getElementById("guardianRelationship").textContent = formatWord(data.GuardianRelationship || "N/A");
      document.getElementById("guardianContact").textContent = data.GuardianContactNumber || "N/A";
      document.getElementById("guardianAddress").textContent = formatSentence(data.GuardianAddress) || "N/A";

      document.getElementById("medicalHistory").textContent =
        formatSentence(data.MedicalHistory || "No medical history available.");
    } else {
      alert("Error: " + (data.error || "Failed to fetch patient data"));
    }
  } catch (error) {
    console.error("Error fetching patient data:", error);
    alert("An error occurred while retrieving patient details.");
  }
});


function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date";

  return date.toLocaleDateString('en-US', {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatName(name) {
  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .trim();
}

function formatWord(word) {
  const lower = word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatSentence(sentence) {
  return sentence
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}


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
