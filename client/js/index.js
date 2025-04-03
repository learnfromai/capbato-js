// Navigation
document.getElementById("patientbtn").addEventListener("click", function () {
  window.location.href = "patients.html";
});

document.getElementById("dashboardbtn").addEventListener("click", function () {
  window.location.href = "index.html";
});

document.getElementById("appointmentbtn").addEventListener("click", function () {
  window.location.href = "appointments.html";
});

document.getElementById("laboratorybtn").addEventListener("click", function () {
  window.location.href = "laboratory.html";
});

document.getElementById("prescriptionbtn").addEventListener("click", function () {
  window.location.href = "prescriptions.html";
});

// Set today's date in the summary card
function updateTodayDate() {
  const today = new Date();
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formatted = today.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
  const dateElement = document.getElementById('today-date');
  if (dateElement) {
    dateElement.textContent = formatted;
  }
}
updateTodayDate();

// Fetch total patient count
fetch('http://localhost:3001/patients/total/count')
  .then(response => response.json())
  .then(data => {
    const countElement = document.getElementById('total-patients');
    if (countElement) {
      countElement.textContent = data.total;
    }
  })
  .catch(error => {
    console.error('Error fetching total patients:', error);
    const countElement = document.getElementById('total-patients');
    if (countElement) {
      countElement.textContent = 'Error';
    }
  });

console.log("Dashboard Summary Loaded");

fetch('http://localhost:3001/appointments/today/confirmed')
  .then(res => res.json())
  .then(data => {
    document.getElementById('todayAppointmentsCount').textContent = data.total;
  })
  .catch(err => console.error("Error fetching today's appointments:", err));

fetch('http://localhost:3001/appointments/today')
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('todayAppointmentsBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    data.forEach(appointment => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${appointment.patient_name}</td>
        <td>${appointment.reason_for_visit}</td>
        <td>${appointment.contact_number}</td>
        <td>${formatTime(appointment.appointment_time)}</td>
        <td>${appointment.status}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error("Error loading today's appointments:", err));

function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12 + 1);
  return `${hour12}:${minute} ${suffix}`;
}
