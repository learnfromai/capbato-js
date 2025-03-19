document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Appointments Page Loaded");

    // ✅ Navigation buttons
    document.getElementById("patientbtn").addEventListener("click", () => window.location.href = "patients.html");
    document.getElementById("dashboardbtn").addEventListener("click", () => window.location.href = "index.html");
    document.getElementById("appointmentbtn").addEventListener("click", () => window.location.href = "appointments.html");

    // ✅ Default date filter
    const dateInput = document.getElementById("appointmentDate");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }

    // ✅ Buttons for filtering
    document.getElementById("filterByDate").addEventListener("click", loadAppointmentsByDate);
    document.getElementById("showAllAppointments").addEventListener("click", loadAllAppointments);

    // ✅ Load all appointments on page load
    loadAllAppointments();

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
                loadAllAppointments(); // ✅ Refresh table
            }
        });
    }
});

// ✅ Function to Load All Appointments
function loadAllAppointments() {
    console.log("🔄 Fetching all appointments from database...");

    fetch("http://localhost:3000/appointments")
        .then(response => response.json())
        .then(data => updateAppointmentsTable(data))
        .catch(error => {
            console.error("🔴 Error fetching appointments:", error);
            document.getElementById("appointmentsTableBody").innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Error loading appointments.</td></tr>`;
        });
}

// ✅ Function to Load Appointments for Selected Date
function loadAppointmentsByDate() {
    console.log("🔄 Fetching appointments for selected date...");

    const selectedDate = document.getElementById("appointmentDate").value;
    if (!selectedDate) {
        alert("⚠️ Please select a date.");
        return;
    }

    fetch("http://localhost:3000/appointments")
        .then(response => response.json())
        .then(data => {
            console.log("📋 All Appointments Fetched:", data);

            let filteredAppointments = data.filter(appointment => {
                return adjustForServerTimezone(appointment.appointment_date) === selectedDate;
            });

            console.log("✅ Filtered Appointments:", filteredAppointments);

            if (filteredAppointments.length === 0) {
                console.warn("⚠️ No appointments found for the selected date.");
                document.getElementById("appointmentsTableBody").innerHTML = `<tr><td colspan="6" style="text-align:center;">No appointments found for the selected date.</td></tr>`;
                return;
            }

            updateAppointmentsTable(filteredAppointments);
        })
        .catch(error => {
            console.error("🔴 Error fetching appointments:", error);
            document.getElementById("appointmentsTableBody").innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Error loading appointments.</td></tr>`;
        });
}

// ✅ Function to Populate the Appointments Table
function updateAppointmentsTable(appointments) {
    let tableBody = document.getElementById("appointmentsTableBody");
    tableBody.innerHTML = ""; // Clear previous data

    if (!appointments || appointments.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No appointments found.</td></tr>`;
        return;
    }

    appointments.forEach((appointment, index) => {
        let statusClass = appointment.status.toLowerCase();
        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${appointment.patient_name}</td>
                <td>${appointment.visit_type}</td>
                <td>${appointment.appointment_date}</td>
                <td>${appointment.appointment_time}</td>
                <td><span class="status ${statusClass}">${appointment.status}</span></td>
                <td>
                    <button class="cancel-btn" data-id="${appointment.id}">Cancel</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Attach event listeners to the cancel buttons
    document.querySelectorAll(".cancel-btn").forEach(button => {
        button.addEventListener("click", function () {
            let appointmentId = this.getAttribute("data-id");
            confirmCancellation(appointmentId);
        });
    });

    console.log("✅ Appointments table updated!");
}

function confirmCancellation(appointmentId) {
    let confirmation = confirm("Are you sure you want to cancel this appointment?");
    if (confirmation) {
        cancelAppointment(appointmentId);
    }
}

async function cancelAppointment(appointmentId) {
    try {
        const response = await fetch(`http://localhost:3000/appointments/cancel/${appointmentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Cancelled" })
        });

        const data = await response.json();
        console.log("🟢 Appointment cancelled:", data);

        if (response.ok) {
            alert("✅ Appointment cancelled successfully!");
            loadAllAppointments(); // Refresh the table
        } else {
            alert("⚠️ Error: " + data.error);
        }
    } catch (error) {
        console.error("🔴 Error cancelling appointment:", error);
        alert("❌ Failed to cancel appointment.");
    }
}

function adjustForServerTimezone(isoString){
    const date = new Date(isoString);
    date.setHours(date.getHours() + 8);
    return date.toISOString().split('T')[0];
};