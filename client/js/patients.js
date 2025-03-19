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

    // ✅ Listen for form submission from iframe
    window.addEventListener("message", function (event) {
      if (event.data === "patientAdded") {
        loadPatients(); // Refresh table after new patient is added
        document.getElementById("overlay").style.display = "none"; // Close form
        iframe.src = ""; // Reset iframe
      }
    });
  }
});

// Sorting state
let sortColumn = "last_name"; // Default: Sort by Last Name
let sortAscending = true; // Default: Ascending order
let patientsData = []; // Store fetched patient data

// Fetch and display patient records
function loadPatients() {
  fetch("http://localhost:3000/patients")
    .then((response) => response.json())
    .then((data) => {
      patientsData = data; // Store data globally
      renderTable(data);
    })
    .catch((error) => console.error("🔴 Error fetching data:", error));
}

// Function to render patient table with sorting and search
function renderTable(data) {
  let tableBody = document.getElementById("patientTableBody");
  tableBody.innerHTML = ""; // Clear previous data

  // Sorting logic
  data.sort((a, b) => {
    let valueA = a[sortColumn];
    let valueB = b[sortColumn];

    // If sorting by Last Name (alphabetically)
    if (sortColumn === "last_name") {
      valueA = valueA.toUpperCase();
      valueB = valueB.toUpperCase();
      return sortAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    // If sorting by Patient ID (numerically)
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

// ✅ Search Function
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

// Add event listeners to table headers
document.addEventListener("DOMContentLoaded", function () {
  loadPatients();

  // Sorting Last Name
  document.querySelector("th:nth-child(2)").addEventListener("click", function () {
    sortColumn = "last_name";
    sortAscending = !sortAscending;
    renderTable(patientsData);
  });

  // Sorting Patient ID
  document.querySelector("th:nth-child(1)").addEventListener("click", function () {
    sortColumn = "patient_id";
    sortAscending = !sortAscending;
    renderTable(patientsData);
  });
});
