document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("patientbtn").addEventListener("click", function () {
    window.location.href = "patients.html";
  });

  document.getElementById("dashboardbtn").addEventListener("click", function () {
    window.location.href = "index.html";
  });

  document.getElementById("appointmentbtn").addEventListener("click", function () {
    window.location.href = "appointments.html";
  });

  let addPatientBtn = document.querySelector(".add-patient-btn");
  let overlay = document.getElementById("overlay");
  let iframe = document.getElementById("addPatientIframe");
  let closeBtn = document.getElementById("closeBtn");

  if (addPatientBtn && overlay && iframe && closeBtn) {
    addPatientBtn.addEventListener("click", function () {
      overlay.style.display = "flex";
      iframe.src = "addpatientbtnform.html";
    });

    closeBtn.addEventListener("click", function () {
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
});

let sortColumn = "last_name"; 
let sortAscending = true;
let patientsData = []; 

function loadPatients() {
  fetch("http://localhost:3000/patients")
    .then((response) => response.json())
    .then((data) => {
      patientsData = data;
      renderTable(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderTable(data) {
  let tableBody = document.getElementById("patientTableBody");
  tableBody.innerHTML = ""; // Clear previous data

  data.sort((a, b) => {
    let valueA = a[sortColumn];
    let valueB = b[sortColumn];

    if (sortColumn === "last_name") {
      valueA = valueA.toUpperCase();
      valueB = valueB.toUpperCase();
      return sortAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    if (sortColumn === "patient_id") {
      return sortAscending ? a.patient_id - b.patient_id : b.patient_id - a.patient_id;
    }

    return 0;
  });

  data.forEach((patient) => {
    let row = `<tr>
                  <td>${patient.patient_id}</td>
                  <td><a href="patientInfo.html?patient_id=${patient.patient_id}" class="patient-link">${patient.last_name.toUpperCase()}</a></td>
                  <td>${patient.first_name.toUpperCase()}</td>
                  <td>${patient.middle_name ? patient.middle_name.toUpperCase() : ''}</td>
                  <td>${patient.date_of_birth}</td>
              </tr>`;
    tableBody.innerHTML += row;
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  let searchText = this.value.toLowerCase();

  let filteredData = patientsData.filter((patient) => {
    return (
      patient.patient_id.toString().includes(searchText) ||
      patient.last_name.toLowerCase().includes(searchText) ||
      patient.first_name.toLowerCase().includes(searchText) ||
      (patient.middle_name && patient.middle_name.toLowerCase().includes(searchText))
    );
  });

  renderTable(filteredData);
});

document.addEventListener("DOMContentLoaded", function () {
  loadPatients();

  document.querySelector("th:nth-child(2)").addEventListener("click", function () {
    sortColumn = "last_name";
    sortAscending = !sortAscending;
    renderTable(patientsData);
  });

  document.querySelector("th:nth-child(1)").addEventListener("click", function () {
    sortColumn = "patient_id";
    sortAscending = !sortAscending;
    renderTable(patientsData);
  });
});
