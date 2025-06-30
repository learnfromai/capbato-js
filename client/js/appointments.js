let lastViewedDate = null;

document.addEventListener("DOMContentLoaded", function () {
    console.log("Appointments Page Loaded");

    document.getElementById("patientbtn").addEventListener("click", () => window.location.href = "patients.html");
    document.getElementById("dashboardbtn").addEventListener("click", () => window.location.href = "index.html");
    document.getElementById("appointmentbtn").addEventListener("click", () => {
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("appointmentDate").value = today;
        lastViewedDate = today;
        loadAppointmentsByDate(today);
    });
    document.getElementById("laboratorybtn").addEventListener("click", () => window.location.href = "laboratory.html");
    document.getElementById("prescriptionbtn").addEventListener("click", () => window.location.href = "prescriptions.html");
    document.getElementById("schedulebtn").addEventListener("click", () => window.location.href = "doctor-schedule.html");



    const dateInput = document.getElementById("appointmentDate");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
        lastViewedDate = today;
    }

    document.getElementById("filterByDate").addEventListener("click", function () {
        const selectedDate = document.getElementById("appointmentDate").value;
        lastViewedDate = selectedDate;
        loadAppointmentsByDate(selectedDate);
    });

    document.getElementById("showAllAppointments").addEventListener("click", () => {
        lastViewedDate = null;
        loadAllAppointments();
    });

    loadAppointmentsByDate(lastViewedDate || new Date().toISOString().split("T")[0]);

    const addAppointmentBtn = document.getElementById("openAddAppointment");
    const overlay = document.getElementById("addAppointmentOverlay");
    const iframe = document.getElementById("addAppointmentIframe");
    const closeBtn = document.getElementById("closeAddAppointment");

    if (addAppointmentBtn && overlay && iframe && closeBtn) {
        addAppointmentBtn.addEventListener("click", function () {
            overlay.style.display = "flex";
            iframe.src = "add-appointments.html";
          
            iframe.onload = () => {
              // Reset the form and clear previous data
              iframe.contentWindow.postMessage({ type: "resetForm" }, "*");
            };
          });
          

        closeBtn.addEventListener("click", function () {
            overlay.style.display = "none";
            iframe.src = "";
        });

        window.addEventListener("message", function (event) {
            if (event.data && event.data.type === "appointmentAdded") {
                if (event.data.date) {
                    lastViewedDate = event.data.date;
                    document.getElementById("appointmentDate").value = lastViewedDate;
                    loadAppointmentsByDate(lastViewedDate);
                } else if (lastViewedDate) {
                    loadAppointmentsByDate(lastViewedDate);
                } else {
                    loadAllAppointments();
                }
            }

            if (event.data && event.data.type === "showToast" && event.data.message) {
                showToast(event.data.message);
            }
        });
    }
});

function formatNameProperCase(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

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
    fetch("http://localhost:3001/appointments")
        .then(response => response.json())
        .then(data => updateAppointmentsTable(data))
        .catch(error => {
            console.error("Error fetching appointments:", error);
            document.getElementById("appointmentsTableBody").innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Error loading appointments.</td></tr>`;
            document.getElementById("appointmentCount").textContent = `Total Appointments: 0`;
        });
}

function loadAppointmentsByDate(date = null) {
    const selectedDate = date || document.getElementById("appointmentDate").value;
    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    fetch("http://localhost:3001/appointments")
        .then(response => response.json())
        .then(data => {
            let filteredAppointments = data.filter(appointment => appointment.appointment_date === selectedDate);
            updateAppointmentsTable(filteredAppointments);
        })
        .catch(error => {
            console.error("Error fetching appointments:", error);
            document.getElementById("appointmentsTableBody").innerHTML = `<tr><td colspan="7" style="text-align:center;color:red;">Error loading appointments.</td></tr>`;
            document.getElementById("appointmentCount").textContent = `Total Appointments: 0`;
        });
}

function updateAppointmentsTable(appointments) {
    const tableBody = document.getElementById("appointmentsTableBody");
    tableBody.innerHTML = "";

    const confirmed = appointments.filter(a => a.status === "Confirmed").length;
    const cancelled = appointments.filter(a => a.status === "Cancelled").length;
    
    // Check if we're viewing today's appointments to show filtered message
    const selectedDate = document.getElementById("appointmentDate").value;
    const today = new Date().toISOString().split("T")[0];
    const isToday = selectedDate === today;
    
    let countText = `Total Appointments: ${appointments.length} (${confirmed} Confirmed, ${cancelled} Cancelled)`;
    
    document.getElementById("appointmentCount").textContent = countText;

    if (!appointments || appointments.length === 0) {
        const noAppointmentsMessage = isToday ? 
            "No upcoming appointments for today." : 
            "No appointments found.";
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">${noAppointmentsMessage}</td></tr>`;
        return;
    }

    // Only sort from latest to oldest if "Show All" is active (lastViewedDate is null)
    if (lastViewedDate === null) {
        appointments.sort((a, b) => {
            let dateTimeA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            let dateTimeB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return dateTimeB - dateTimeA;
        });
    }

    appointments.forEach((appointment, index) => {
        const statusClass = appointment.status.toLowerCase();
        const formattedTime = formatTo12HourTime(appointment.appointment_time);
        const formattedDate = formatDateToReadable(appointment.appointment_date);

        let actionButtons = "";
        if (appointment.status === "Cancelled") {
            actionButtons += `<button class="reconfirm-btn" data-id="${appointment.id}">Reconfirm</button>`;
        } else {
            actionButtons += `<button class="modify-btn" data-id="${appointment.id}">Modify</button>`;
            actionButtons += `<button class="cancel-btn" data-id="${appointment.id}">Cancel</button>`;
        }

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${formatNameProperCase(appointment.patient_name)}</td>
                <td>${appointment.reason_for_visit}</td>
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
                <td>${appointment.doctor_name || 'N/A'}</td>
                <td><span class="status ${statusClass}">${appointment.status}</span></td>
                <td>${actionButtons}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    document.querySelectorAll(".cancel-btn").forEach(button => {
        button.addEventListener("click", function () {
            const appointmentId = this.getAttribute("data-id");
            confirmCancellation(appointmentId);
        });
    });

    document.querySelectorAll(".reconfirm-btn").forEach(button => {
        button.addEventListener("click", function () {
            const appointmentId = this.getAttribute("data-id");
            const appointment = appointments.find(app => app.id == appointmentId);
            if (!appointment) return alert("Appointment not found.");

            const confirmedCount = appointments.filter(app =>
                app.appointment_date === appointment.appointment_date &&
                app.appointment_time === appointment.appointment_time &&
                app.status === "Confirmed"
            ).length;

            if (confirmedCount >= 4) {
                const iframe = document.getElementById("addAppointmentIframe");
                const overlay = document.getElementById("addAppointmentOverlay");

                overlay.style.display = "flex";
                iframe.src = "add-appointments.html";

                iframe.onload = () => {
                    iframe.contentWindow.postMessage({
                        type: "editAppointment",
                        data: {
                            ...appointment,
                            status: "Confirmed"
                        }
                    }, "*");
                };
            } else {
                showConfirmationModal("Reconfirm this appointment?", () => {
                    updateAppointmentStatus(appointmentId, "Confirmed");
                });
            }
        });
    });

    document.querySelectorAll(".modify-btn").forEach(button => {
        button.addEventListener("click", function () {
            const appointmentId = this.getAttribute("data-id");
            const appointmentData = appointments.find(app => app.id == appointmentId);
            const iframe = document.getElementById("addAppointmentIframe");
            const overlay = document.getElementById("addAppointmentOverlay");

            overlay.style.display = "flex";
            iframe.src = "add-appointments.html";

            iframe.onload = () => {
                iframe.contentWindow.postMessage({
                    type: "editAppointment",
                    data: appointmentData
                }, "*");
            };
        });
    });
}

function confirmCancellation(appointmentId) {
    showConfirmationModal("Are you sure you want to cancel this appointment?", () => {
        updateAppointmentStatus(appointmentId, "Cancelled");
    });
}

async function updateAppointmentStatus(appointmentId, newStatus) {
    try {
        const response = await fetch(`http://localhost:3001/appointments/cancel/${appointmentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();
        if (response.ok) {
            showToast(`Appointment ${newStatus.toLowerCase()} successfully!`);
            if (lastViewedDate) {
                loadAppointmentsByDate(lastViewedDate);
            } else {
                loadAllAppointments();
            }
        } else {
            showToast(data.error || "An error occurred.");
        }
    } catch (error) {
        console.error("Error updating appointment:", error);
        alert("Failed to update appointment.");
    }
}

function showConfirmationModal(message, onConfirm) {
    const modal = document.getElementById("confirmationModal");
    const text = document.getElementById("confirmationText");
    const yesBtn = document.getElementById("confirmYes");
    const noBtn = document.getElementById("confirmNo");

    text.textContent = message;
    modal.classList.remove("hidden");

    const cleanUp = () => {
        modal.classList.add("hidden");
        yesBtn.removeEventListener("click", handleYes);
        noBtn.removeEventListener("click", handleNo);
    };

    const handleYes = () => {
        onConfirm();
        cleanUp();
    };

    const handleNo = () => {
        cleanUp();
    };

    yesBtn.addEventListener("click", handleYes);
    noBtn.addEventListener("click", handleNo);
}

function showToast(message, duration = 2000) {
    const toast = document.getElementById("toastNotification");
    const toastText = document.getElementById("toastMessage");

    toastText.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hidden");
    }, duration);
}

// === Show role on navbar ===
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

