document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("patientbtn").addEventListener("click", () => {
    window.location.href = "patients.html";
  });

  document.getElementById("dashboardbtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  document.getElementById("appointmentbtn").addEventListener("click", () => {
    window.location.href = "appointments.html";
  });

  document.getElementById("laboratorybtn").addEventListener("click", () => {
    window.location.href = "laboratory.html";
  });

  document.getElementById("prescriptionbtn").addEventListener("click", () => {
    window.location.href = "prescriptions.html";
  });

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
    const formattedName = toTitleCase(patient.full_name || "");
    const row = `
      <tr>
        <td>${patient.patient_id}</td>
        <td>
          <a href="patientInfo.html?patient_id=${patient.patient_id}" class="patient-link">
            ${formattedName}
          </a>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  const filteredData = patientsData.filter((patient) =>
    patient.patient_id.toLowerCase().includes(searchText) ||
    patient.full_name.toLowerCase().includes(searchText)
  );
  renderTable(filteredData);
});

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("loggedInRole");
  const display = document.getElementById("roleDisplay");
  if (display && role) {
    display.textContent = role.toUpperCase();
  }
});

