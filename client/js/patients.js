const buttons = {
  patientbtn: "patients.html",
  dashboardbtn: "index.html",
  appointmentbtn: "appointments.html",
  laboratorybtn: "laboratory.html",
  prescriptionbtn: "prescriptions.html",
  schedulebtn: "doctor-schedule.html"
};

document.addEventListener("DOMContentLoaded", function () {
  // Role & Username Display
  const role = localStorage.getItem("loggedInRole");
  const username = localStorage.getItem("loggedInUsername");

  const roleDisplay = document.getElementById("roleDisplay");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (role && roleDisplay) {
    roleDisplay.textContent = role.toUpperCase();
  }

  if (username && usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  // Navigation Setup
  Object.entries(buttons).forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = url;
      });
    }
  });

  // Overlay logic
  const addPatientBtn = document.querySelector(".add-new-patient-btn");
  const overlay = document.getElementById("overlay");
  const iframe = document.getElementById("addPatientIframe");
  const closeBtn = document.getElementById("closeBtn");

  if (addPatientBtn && overlay && iframe && closeBtn) {
    addPatientBtn.addEventListener("click", () => {
      overlay.style.display = "flex";
      iframe.src = "addpatientbtnform.html";
    });

    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
      iframe.src = "";
    });

    window.addEventListener("message", function (event) {
      if (event.data === "patientAdded") {
        loadPatients();
        overlay.style.display = "none";
        iframe.src = "";
      }
    });
  }

  loadPatients();
});

let patientsData = [];

function loadPatients() {
  fetch("http://localhost:3001/patients")
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      patientsData = data;
      renderTable(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderTable(data) {
  const tableBody = document.getElementById("patientTableBody");
  tableBody.innerHTML = "";

  if (!data || data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center;">No patients found.</td>
      </tr>`;
    return;
  }

  data.forEach((patient) => {

    const first = toTitleCase(patient.FirstName || "");
    const middle = toTitleCase(patient.MiddleName || "");
    const last = toTitleCase(patient.LastName || "");
    const fullName = `${first}${middle ? " " + middle : ""} ${last}`.trim();

    const row = `
      <tr>
        <td>${patient.PatientID}</td>
        <td>
          <a href="patientInfo.html?patient_id=${patient.PatientID}" class="patient-link">
            ${fullName}
          </a>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  const filteredData = patientsData.filter((patient) => {
    const fullName = `${patient.LastName} ${patient.FirstName} ${patient.MiddleName}`.toLowerCase();
    return (
      patient.PatientID.toLowerCase().includes(searchText) ||
      fullName.includes(searchText)
    );
  });
  renderTable(filteredData);
});
