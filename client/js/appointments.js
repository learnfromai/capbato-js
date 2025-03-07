document.getElementById("patientbtn").addEventListener("click", function () {
    window.location.href = "patients.html";
  });
  
  document.getElementById("dashboardbtn").addEventListener("click", function () {
    window.location.href = "index.html";
  });
  
  document.getElementById("appointmentbtn").addEventListener("click", function () {
    window.location.href = "appointments.html";
  });

  document.addEventListener("DOMContentLoaded", loadAppointments);

function loadAppointments() {
    fetch("http://localhost:3000/appointments") // Ensure backend is running
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById("appointmentsTableBody");
            tableBody.innerHTML = ""; // Clear previous data

            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No appointments found.</td></tr>`;
            } else {
                data.forEach((appointment, index) => {
                    let statusClass = appointment.status.toLowerCase();
                    let row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${appointment.patient_name}</td>
                            <td>${appointment.visit_type}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.time}</td>
                            <td><span class="status ${statusClass}">${appointment.status}</span></td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            }
        })
        .catch(error => console.error("🔴 Error fetching appointments:", error));
}
