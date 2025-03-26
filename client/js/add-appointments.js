const timeSelect = document.getElementById("time");
const dateInput = document.getElementById("date");
const timeNotice = document.getElementById("timeNotice");
const formError = document.getElementById("formError");

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);
let latestAppointments = [];

document.addEventListener("DOMContentLoaded", () => {
  populateTimeOptions();
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
  fetchTimeAvailability(today);
});

dateInput.addEventListener("change", (e) => {
  fetchTimeAvailability(e.target.value);
});

function populateTimeOptions() {
  timeSelect.innerHTML = "";
  HOURS.forEach((hour) => {
    const option = document.createElement("option");
    option.value = `${String(hour).padStart(2, "0")}:00`;
    option.text = formatOptionLabel(option.value);
    timeSelect.appendChild(option);
  });
}

function formatOptionLabel(value) {
  const hour = parseInt(value.split(":")[0], 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const labelHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${labelHour}:00 ${ampm}`;
}

async function fetchTimeAvailability(date) {
  try {
    const response = await fetch("http://localhost:3000/appointments");
    const appointments = await response.json();
    latestAppointments = appointments;

    const timeCounts = {};
    appointments
      .filter((app) => app.appointment_date === date && app.status === "Confirmed")
      .forEach((app) => {
        timeCounts[app.appointment_time] = (timeCounts[app.appointment_time] || 0) + 1;
      });

    let allDisabled = true;

    Array.from(timeSelect.options).forEach((option) => {
      const count = timeCounts[option.value] || 0;
      if (count >= 4) {
        option.disabled = true;
        option.text = `${formatOptionLabel(option.value)} (Full)`;
      } else {
        option.disabled = false;
        option.text = formatOptionLabel(option.value);
        allDisabled = false;
      }
    });

    timeNotice.style.display = allDisabled ? "block" : "none";
  } catch (error) {
    console.error("Error loading time availability:", error);
  }
}

function showInlineError(msg) {
  formError.textContent = msg;
  formError.style.display = "block";
}

function clearInlineError() {
  formError.textContent = "";
  formError.style.display = "none";
}

document.getElementById("addAppointmentForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  clearInlineError();

  const patient_name = document.getElementById("patientName").value.trim();
  const reason_for_visit = document.getElementById("visitType").value.trim();
  const appointment_date = document.getElementById("date").value;
  const appointment_time = document.getElementById("time").value;
  const editId = this.dataset.editId;
  const isEditing = !!editId;
  const originalApp = latestAppointments.find(app => app.id == editId);

  if (!patient_name || !reason_for_visit || !appointment_date || !appointment_time) {
    showInlineError("Please fill in all fields.");
    return;
  }

  let status = "Confirmed";
  if (isEditing && originalApp?.status === "Cancelled") {
    status = "Confirmed";
  } else if (isEditing) {
    status = originalApp.status;
  }

  const timeCounts = {};
  latestAppointments
    .filter(app => app.appointment_date === appointment_date && app.status === "Confirmed" && (!isEditing || app.id != editId))
    .forEach(app => {
      timeCounts[app.appointment_time] = (timeCounts[app.appointment_time] || 0) + 1;
    });

  if (timeCounts[appointment_time] >= 4) {
    showInlineError("That time is already fully booked. Please choose another.");
    return;
  }

  const url = isEditing
    ? `http://localhost:3000/appointments/update/${editId}`
    : "http://localhost:3000/appointments/add";
  const method = isEditing ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_name,
        reason_for_visit,
        appointment_date,
        appointment_time,
        status,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      window.parent.postMessage({ type: "appointmentAdded", date: appointment_date }, "*");
      window.parent.document.getElementById("addAppointmentOverlay").style.display = "none";
      this.reset();
      delete this.dataset.editId;

      const message = isEditing
        ? "Appointment updated successfully!"
        : "Appointment added successfully!";
      window.parent.postMessage({ type: "showToast", message }, "*");
    } else {
      showInlineError(data.error || "An error occurred while submitting the appointment.");
    }
  } catch (error) {
    console.error("Error submitting appointment:", error);
    showInlineError("Failed to submit appointment.");
  }
});

window.addEventListener("message", function (event) {
  if (event.data && event.data.type === "editAppointment") {
    const app = event.data.data;
    document.getElementById("patientName").value = app.patient_name;
    document.getElementById("visitType").value = app.reason_for_visit;
    document.getElementById("date").value = app.appointment_date;

    fetchTimeAvailability(app.appointment_date).then(() => {
      document.getElementById("time").value = app.appointment_time;
    });

    document.getElementById("addAppointmentForm").dataset.editId = app.id;
  }
});
