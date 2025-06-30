// ✅ index.js (Updated): Dashboard shows Doctor, Current Patient, Total Appointments only

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("loggedInRole");
  const username = localStorage.getItem("loggedInUsername");

  const roleDisplay = document.getElementById("roleDisplay");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (role && roleDisplay) {
    roleDisplay.textContent = role.toUpperCase();
    roleDisplay.classList.add("ms-auto");
  }

  if (username && usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  const buttons = {
    patientbtn: "patients.html",
    dashboardbtn: "index.html",
    appointmentbtn: "appointments.html",
    laboratorybtn: "laboratory.html",
    prescriptionbtn: "prescriptions.html",
    schedulebtn: "doctor-schedule.html"
  };

  Object.entries(buttons).forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = url;
      });
    }
  });

  updateTodayDate();
  fetchDoctorOfDay();
  refreshDashboardData();
  fetchCurrentPatient();
  setInterval(refreshDashboardData, 10000);
  setInterval(fetchCurrentPatient, 10000);
});

function updateTodayDate() {
  const today = new Date();
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formatted = today.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
  const dateElement = document.getElementById('today-date');
  if (dateElement) {
    dateElement.textContent = formatted;
  }
}

function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12 + 1);
  return `${hour12}:${minute} ${suffix}`;
}

function formatName(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function refreshDashboardData() {
  fetch('http://localhost:3001/appointments/today/confirmed')
    .then(res => res.json())
    .then(data => {
      const count = document.getElementById('todayAppointmentsCount');
      if (count) count.textContent = data.total;
    })
    .catch(err => console.error("Error fetching today's total confirmed appointments:", err));

  fetch('http://localhost:3001/appointments/today')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('todayAppointmentsBody');
      if (!tbody) return;

      tbody.innerHTML = '';

      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      data
        .filter(appointment => {
          const [h, m] = appointment.appointment_time.split(':').map(Number);
          const apptMinutes = h * 60 + m;
          return apptMinutes >= nowMinutes;
        })
        .forEach(appointment => {
          const formattedName = formatName(appointment.patient_name);

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${appointment.patient_id || 'N/A'}</td>
            <td>
              <a href="patientinfo.html?patient_id=${appointment.patient_id}" class="patient-link">
                ${formattedName}
              </a>
            </td>
            <td>${appointment.reason_for_visit}</td>
            <td>${appointment.contact_number}</td>
            <td>${formatTime(appointment.appointment_time)}</td>
            <td>${appointment.doctor_name || 'N/A'}</td>
            <td>${appointment.status}</td>
          `;

          tbody.appendChild(row);
        });
    })
    .catch(err => console.error("Error loading today's appointments:", err));
}

function fetchCurrentPatient() {
  fetch('http://localhost:3001/appointments/today')
    .then(res => res.json())
    .then(data => {
      const now = new Date();
      const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:MM"

      let closest = null;
      let minDiff = Infinity;

      data.forEach(appt => {
        const [h, m] = appt.appointment_time.split(':');
        const apptDate = new Date();
        apptDate.setHours(+h, +m, 0, 0);

        const diff = Math.abs(apptDate - now);
        if (apptDate <= now && diff < minDiff) {
          minDiff = diff;
          closest = appt;
        }
      });

      const display = document.getElementById("currentPatient");
      if (display) {
        display.textContent = closest ? formatName(closest.patient_name) : "N/A";
      }
    })
    .catch(err => {
      console.error("Error fetching current patient:", err);
      const display = document.getElementById("currentPatient");
      if (display) display.textContent = "Error";
    });
}

function fetchDoctorOfDay() {
  fetch("http://localhost:3001/schedules/today")
    .then(res => res.json())
    .then(data => {
      const doctorDisplay = document.getElementById("doctor-of-day");
      if (doctorDisplay) {
        doctorDisplay.textContent = data.doctor_name || "N/A";
      }
    })
    .catch(err => {
      console.error("Failed to fetch today's doctor:", err);
      document.getElementById("doctor-of-day").textContent = "N/A";
    });
}
