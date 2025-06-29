// patientinfo.js (fully updated with UI-matched lab requests)

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("patient_id");

  if (!patientId) {
    alert("No patient ID provided!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001/patients/${patientId}`);
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
    } else {
      alert("Error: " + (data.error || "Failed to fetch patient data"));
    }
  } catch (error) {
    console.error("Error fetching patient data:", error);
    alert("An error occurred while retrieving patient details.");
  }

  const medicalTab = document.getElementById("medicalTab");
  const appointmentTab = document.getElementById("appointmentTab");
  const prescriptionTab = document.getElementById("prescriptionTab");
  const laboratoryTab = document.getElementById("laboratoryTab");

  const medicalContent = document.getElementById("medicalContent");
  const appointmentContent = document.getElementById("appointmentContent");

  medicalTab.addEventListener("click", () => {
    hideTabs();
    medicalTab.classList.add("active");
    medicalContent.style.display = "block";
  });

  appointmentTab.addEventListener("click", () => {
    hideTabs();
    appointmentTab.classList.add("active");
    appointmentContent.style.display = "block";
    loadAppointmentsForPatient();
  });

  prescriptionTab.addEventListener("click", () => {
    hideTabs();
    prescriptionTab.classList.add("active");
  });

  laboratoryTab.addEventListener("click", () => {
    hideTabs();
    laboratoryTab.classList.add("active");
    renderLabTestsForPatient(patientId);
  });

  function hideTabs() {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    if (medicalContent) medicalContent.style.display = "none";
    if (appointmentContent) appointmentContent.style.display = "none";
    const labContainer = document.getElementById("labResultContainer");
    if (labContainer) labContainer.remove();
  }

  function loadAppointmentsForPatient() {
    const tbody = document.getElementById("appointmentListBody");
    tbody.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

    fetch(`http://localhost:3001/appointments/patient/${patientId}`)
      .then(res => res.json())
      .then(data => {
        tbody.innerHTML = "";

        if (!data.length) {
          tbody.innerHTML = `<tr><td colspan="4">No appointments found.</td></tr>`;
          return;
        }

        data.forEach(app => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${formatDate(app.appointment_date)}</td>
            <td>${formatTime(app.appointment_time)}</td>
            <td>${app.reason_for_visit}</td>
            <td>${app.status}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => {
        console.error("Failed to fetch appointments:", err);
        tbody.innerHTML = `<tr><td colspan="4" style="color:red;">Error loading data</td></tr>`;
      });
  }

  function renderLabTestsForPatient(patientId) {
    fetch("http://localhost:3001/api/lab_requests")
      .then(res => res.json())
      .then(data => {
        const labData = data.filter(lab => String(lab.patient_id) === String(patientId));
        const container = document.createElement("div");
        container.id = "labResultContainer";
        container.classList.add("tab-content");
        container.innerHTML = `
          <h3>Laboratory Requests</h3>
          <table class="appointment-table">
            <thead><tr><th>Test</th><th>Date</th><th>Status</th></tr></thead>
            <tbody id="labResultsTableBody"></tbody>
          </table>
        `;
        document.querySelector(".right-actions-container").appendChild(container);

        const tbody = document.getElementById("labResultsTableBody");

        if (!labData.length) {
          tbody.innerHTML = `<tr><td colspan="3">No lab requests found.</td></tr>`;
          return;
        }

        labData.forEach(req => {
          const date = req.request_date || req.date;
          const formattedDate = formatDate(date);
          const testNames = [];

          Object.entries(req).forEach(([key, val]) => {
            if (val === "yes") testNames.push(key.replace(/_/g, " ").toUpperCase());
          });

          tbody.innerHTML += `
            <tr>
              <td>${testNames.join(", ")}</td>
              <td>${formattedDate}</td>
              <td>${req.status || "Pending"}</td>
            </tr>
          `;
        });
      });
  }
});

// ========== Utilities ==========

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return "N/A";
  return date.toLocaleDateString('en-US', {
    year: "numeric",
    month: "long",
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

function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(":");
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12 + 1);
  return `${hour12}:${minute} ${suffix}`;
}

function goBack() {
  if (document.referrer.includes("patients.html")) {
    window.location.href = "patients.html";
  } else {
    window.history.back();
  }
}

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
document.getElementById("laboratorybtn").addEventListener("click", () => {
  window.location.href = "laboratory.html";
});
document.getElementById("prescriptionbtn").addEventListener("click", () => {
  window.location.href = "prescriptions.html";
});

document.addEventListener("DOMContentLoaded", () => {
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
});
