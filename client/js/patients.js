document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("patientbtn").addEventListener("click", function () {
    window.location.href = "patients.html";
  });

  document
    .getElementById("dashboardbtn")
    .addEventListener("click", function () {
      window.location.href = "dashboard.html";
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

    // Listen for form submission from iframe
    window.addEventListener("message", function (event) {
      if (event.data === "patientAdded") {
        loadPatients(); // Refresh table after new patient is added
        document.getElementById("overlay").style.display = "none"; // Close form
      }
    });
  }
});

// Fetch patient records from Node.js server
function loadPatients() {
  fetch("http://localhost:3000/patients")
    .then((response) => response.json())
    .then((data) => {
      let tableBody = document.getElementById("patientTableBody");
      tableBody.innerHTML = ""; // Clear previous data

      data.forEach((patient) => {
        let row = `<tr>
                  <td>${patient.patient_id}</td>
                  <td>${patient.last_name}</td>
                  <td>${patient.first_name}</td>
                  <td>${patient.middle_name}</td>
                  <td>${patient.date_of_birth}</td>
              </tr>`;
        tableBody.innerHTML += row;
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

document.addEventListener("DOMContentLoaded", loadPatients);
