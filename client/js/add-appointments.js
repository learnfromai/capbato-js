const timeSelect = document.getElementById("time");
const dateInput = document.getElementById("date");
const timeNotice = document.getElementById("timeNotice");

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM
let latestAppointments = []; // 🆕 store fetched appointments

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
    latestAppointments = appointments; // 🆕 store appointments globally

    const timeCounts = {};
    appointments
      .filter((app) => app.appointment_date === date)
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

document.getElementById("addAppointmentForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const patient_name = document.getElementById("patientName").value.trim();
  const reason_for_visit = document.getElementById("visitType").value.trim();
  const appointment_date = document.getElementById("date").value;
  const appointment_time = document.getElementById("time").value;
  const status = "Confirmed";
  const editId = this.dataset.editId;

  if (!patient_name || !reason_for_visit || !appointment_date || !appointment_time) {
    alert("Please fill in all fields.");
    return;
  }

  const timeCounts = {};
  latestAppointments
    .filter((app) => app.appointment_date === appointment_date)
    .forEach((app) => {
      timeCounts[app.appointment_time] = (timeCounts[app.appointment_time] || 0) + 1;
    });

  const isEditing = !!editId;
  const originalApp = latestAppointments.find(app => app.id == editId);
  const isSameTime = isEditing && originalApp?.appointment_time === appointment_time && originalApp?.appointment_date === appointment_date;

  if (timeCounts[appointment_time] >= 4 && !isSameTime) {
    alert("That time is already fully booked. Please choose another.");
    return;
  }

  const url = editId
    ? `http://localhost:3000/appointments/update/${editId}`
    : "http://localhost:3000/appointments/add";
  const method = editId ? "PUT" : "POST";

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

      const message = editId
        ? "Appointment updated successfully!"
        : "Appointment added successfully!";
      window.parent.postMessage({ type: "showToast", message }, "*");
    } else {
      alert("Error: " + data.error);
    }
  } catch (error) {
    console.error("Error submitting appointment:", error);
    alert("Failed to submit appointment.");
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
