document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Appointments Page Loaded");

    // ✅ Navigation buttons
    document.getElementById("patientbtn").addEventListener("click", () => window.location.href = "patients.html");
    document.getElementById("dashboardbtn").addEventListener("click", () => window.location.href = "index.html");
    document.getElementById("appointmentbtn").addEventListener("click", () => window.location.href = "appointments.html");

    loadAppointments(); // ✅ Load appointments on page load

    // ✅ Floating form elements
    const addAppointmentBtn = document.getElementById("openAddAppointment");
    const overlay = document.getElementById("addAppointmentOverlay");
    const iframe = document.getElementById("addAppointmentIframe");
    const closeBtn = document.getElementById("closeAddAppointment");

    if (addAppointmentBtn && overlay && iframe && closeBtn) {
        addAppointmentBtn.addEventListener("click", function () {
            console.log("🟢 Opening Add Appointment form");
            overlay.style.display = "flex";
            iframe.src = "add-appointments.html"; // Load form
        });

        closeBtn.addEventListener("click", function () {
            console.log("🔴 Closing Add Appointment form");
            overlay.style.display = "none";
            iframe.src = ""; // Reset iframe to prevent caching issues
        });

        // ✅ Listen for form submission inside the floating form
        window.addEventListener("message", function (event) {
            if (event.data === "appointmentAdded") {
                console.log("🔄 Refreshing appointments table");
                loadAppointments(); // ✅ Refresh table
            }
        });
        
    }
});

// ✅ Function to Load Appointments
function loadAppointments() {
    console.log("🔄 Fetching appointments from database...");

    fetch("http://localhost:3000/appointments")
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById("appointmentsTableBody");
            tableBody.innerHTML = ""; // Clear previous data

            if (!data || data.length === 0) {
                console.warn("⚠️ No appointments found in the database.");
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No appointments found.</td></tr>`;
                return;
            }

            data.forEach((appointment, index) => {
                let statusClass = appointment.status ? appointment.status.toLowerCase() : "pending";
                let row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${appointment.patient_name}</td>
                        <td>${appointment.visit_type}</td>
                        <td>${appointment.appointment_date}</td>
                        <td>${appointment.appointment_time}</td>
                        <td><span class="status ${statusClass}">${appointment.status}</span></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

            console.log("✅ Appointments table updated successfully!");
        })
        .catch(error => {
            console.error("🔴 Error fetching appointments:", error);
            document.getElementById("appointmentsTableBody").innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Error loading appointments.</td></tr>`;
        });
}
