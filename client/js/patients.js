document.addEventListener("DOMContentLoaded", function () {
  // Navigation buttons
  document.getElementById("patientbtn").addEventListener("click", () => {
    window.location.href = "patients.html";
  });

  document.getElementById("dashboardbtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  document.getElementById("appointmentbtn").addEventListener("click", () => {
    window.location.href = "appointments.html";
  });

  // Add patient modal open
  const addPatientBtn = document.querySelector(".add-patient-btn");
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
        document.getElementById("overlay").style.display = "none";
        iframe.src = ""; 
      }
    });
  }

  // Initial data fetch
  loadPatients();
});

let patientsData = [];

function loadPatients() {
  fetch("http://localhost:3000/patients")
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      patientsData = data;
      renderTable(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderTable(data) {
  const tableBody = document.getElementById("patientTableBody");
  tableBody.innerHTML = "";

  if (!data || data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;">No patients found.</td>
      </tr>`;
    return;
  }

  data.forEach((patient) => {
    const row = `
      <tr>
        <td>${patient.patient_id}</td>
        <td>
          <a href="patientInfo.html?patient_id=${patient.patient_id}" class="patient-link">
            ${patient.full_name}
          </a>
        </td>
        <td>${patient.date_of_birth}</td>
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
