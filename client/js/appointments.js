let lastViewedDate = null; // ✅ Keep track of last viewed date

document.addEventListener("DOMContentLoaded", function () {
    console.log("Appointments Page Loaded");

    document.getElementById("patientbtn").addEventListener("click", () => window.location.href = "patients.html");
    document.getElementById("dashboardbtn").addEventListener("click", () => window.location.href = "index.html");
    document.getElementById("appointmentbtn").addEventListener("click", () => {
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("appointmentDate").value = today;
        lastViewedDate = today;
        loadAppointmentsByDate(today); // ✅ Load today's appointments only
    });

    const dateInput = document.getElementById("appointmentDate");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
        lastViewedDate = today; // ✅ Set lastViewedDate to today on load
    }

    document.getElementById("filterByDate").addEventListener("click", function () {
        const selectedDate = document.getElementById("appointmentDate").value;
        lastViewedDate = selectedDate; // ✅ Update lastViewedDate
        loadAppointmentsByDate(selectedDate);
    });

    document.getElementById("showAllAppointments").addEventListener("click", () => {
        lastViewedDate = null; // ✅ Reset the lastViewedDate when showing all
        loadAllAppointments();
    });

    loadAppointmentsByDate(lastViewedDate || new Date().toISOString().split("T")[0]); // ✅ Load today's appointments by default

    const addAppointmentBtn = document.getElementById("openAddAppointment");
    const overlay = document.getElementById("addAppointmentOverlay");
    const iframe = document.getElementById("addAppointmentIframe");
    const closeBtn = document.getElementById("closeAddAppointment");

    if (addAppointmentBtn && overlay && iframe && closeBtn) {
        addAppointmentBtn.addEventListener("click", function () {
            console.log("Opening Add Appointment form");
            overlay.style.display = "flex";
            iframe.src = "add-appointments.html";
        });

        closeBtn.addEventListener("click", function () {
            console.log("Closing Add Appointment form");
            overlay.style.display = "none";
            iframe.src = "";
        });

        window.addEventListener("message", function (event) {
            if (event.data && event.data.type === "appointmentAdded") {
                console.log("Appointment added! Refreshing table...");

                if (event.data.date) {
                    lastViewedDate = event.data.date;
                    document.getElementById("appointmentDate").value = lastViewedDate;
                    console.log("Reloading appointments for added date:", lastViewedDate);
                    loadAppointmentsByDate(lastViewedDate);
                } else if (lastViewedDate) {
                    console.log("Reloading appointments for last viewed date:", lastViewedDate);
                    loadAppointmentsByDate(lastViewedDate);
                } else {
                    loadAllAppointments();
                }
            }
        });
    }
});

function formatTo12HourTime(timeString) {
    const [hour, minute] = timeString.split(":");
    const h = parseInt(hour, 10);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minute} ${period}`;
}

function formatDateToReadable(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function loadAllAppointments() {
    console.log("Fetching all appointments from database...");

    fetch("http://localhost:3000/appointments")
        .then(response => response.json())
        .then(data => updateAppointmentsTable(data))
        .catch(error => {
            console.error("Error fetching appointments:", error);
            document.getElementById("appointmentsTableBody").innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Error loading appointments.</td></tr>`;
        });
}

function loadAppointmentsByDate(date = null) {
    console.log("Fetching appointments for selected date...");

    const selectedDate = date || document.getElementById("appointmentDate").value;

    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    fetch("http://localhost:3000/appointments")
        .then(response => response.json())
        .then(data => {
            console.log("All Appointments Fetched:", data);

            let filteredAppointments = data.filter(appointment => {
                return appointment.appointment_date === selectedDate;
            });

            console.log("Filtered Appointments:", filteredAppointments);

            if (filteredAppointments.length === 0) {
                document.getElementById("appointmentsTableBody").innerHTML = `<tr><td colspan="7" style="text-align:center;">No appointments found.</td></tr>`;
                return;
            }

            updateAppointmentsTable(filteredAppointments);
        })
        .catch(error => {
            console.error("Error fetching appointments:", error);
            document.getElementById("appointmentsTableBody").innerHTML = `<tr><td colspan="7" style="text-align:center;color:red;">Error loading appointments.</td></tr>`;
        });
}

function updateAppointmentsTable(appointments) {
    let tableBody = document.getElementById("appointmentsTableBody");
    tableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No appointments found.</td></tr>`;
        return;
    }

    appointments.sort((a, b) => {
        let dateTimeA = new Date(`${a.appointment_date}T${a.appointment_time}`);
        let dateTimeB = new Date(`${b.appointment_date}T${b.appointment_time}`);
        return dateTimeA - dateTimeB;
    });

    appointments.forEach((appointment, index) => {
        let statusClass = appointment.status.toLowerCase();
        let formattedTime = formatTo12HourTime(appointment.appointment_time);
        let formattedDate = formatDateToReadable(appointment.appointment_date);

        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${appointment.patient_name}</td>
                <td>${appointment.visit_type}</td>
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
                <td><span class="status ${statusClass}">${appointment.status}</span></td>
                <td>
                    <button class="cancel-btn" data-id="${appointment.id}">Cancel</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    document.querySelectorAll(".cancel-btn").forEach(button => {
        button.addEventListener("click", function () {
            let appointmentId = this.getAttribute("data-id");
            confirmCancellation(appointmentId);
        });
    });

    console.log("Appointments table updated and sorted!");
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
        console.log("Appointment cancelled:", data);

        if (response.ok) {
            alert("Appointment cancelled successfully!");
            if (lastViewedDate) {
                loadAppointmentsByDate(lastViewedDate);
            } else {
                loadAllAppointments();
            }
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        alert("Failed to cancel appointment.");
    }
}
