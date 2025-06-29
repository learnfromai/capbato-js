// doctor-schedule.js

document.addEventListener("DOMContentLoaded", () => {
  // === Role/Username Display ===
  const role = localStorage.getItem("loggedInRole");
  const username = localStorage.getItem("loggedInUsername");

  const roleDisplay = document.getElementById("roleDisplay");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (role && roleDisplay) roleDisplay.textContent = role.toUpperCase();
  if (username && usernameDisplay) usernameDisplay.textContent = username;

  // === Sidebar Navigation ===
  const buttons = {
    dashboardbtn: "index.html",
    appointmentbtn: "appointments.html",
    patientbtn: "patients.html",
    laboratorybtn: "laboratory.html",
    prescriptionbtn: "prescriptions.html",
    schedulebtn: "doctor-schedule.html",
  };

  Object.entries(buttons).forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => (window.location.href = url));
  });

  // === Calendar Logic ===
  const calendar = document.getElementById("calendar");
  const monthLabel = document.getElementById("monthLabel");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");

  let displayDate = new Date();
  let schedulesCache = [];

  function renderCalendar(dateObj, schedules) {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const startDate = new Date(year, month, 1);
    const startDay = startDate.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendar.innerHTML = "";
    monthLabel.textContent = dateObj.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });

    let day = 1 - startDay;
    while (day <= daysInMonth) {
      for (let i = 0; i < 7; i++, day++) {
        const cell = document.createElement("div");
        cell.className = "calendar-cell";

        if (day < 1 || day > daysInMonth) {
          cell.classList.add("inactive");
          calendar.appendChild(cell);
          continue;
        }

        const currentDate = new Date(year, month, day);
        const formatted = currentDate.toISOString().split("T")[0];

        const schedule = schedules.find(s => s.date.startsWith(formatted));
        cell.innerHTML = `<strong>${String(day).padStart(2, "0")}</strong>`;

        if (schedule) {
          const note = document.createElement("div");
          note.className = "schedule-note";
          note.innerHTML = `<strong>${schedule.doctor_name}</strong><br>${schedule.time}`;
          cell.appendChild(note);
        }


        calendar.appendChild(cell);
      }
    }
  }

  function fetchAndRender() {
    fetch("http://localhost:3001/schedules")
      .then(res => res.json())
      .then(data => {
        schedulesCache = data;
        renderCalendar(displayDate, schedulesCache);
      })
      .catch(err => console.error("Failed to load schedules:", err));
  }

  prevMonthBtn?.addEventListener("click", () => {
    displayDate.setMonth(displayDate.getMonth() - 1);
    renderCalendar(displayDate, schedulesCache);
  });

  nextMonthBtn?.addEventListener("click", () => {
    displayDate.setMonth(displayDate.getMonth() + 1);
    renderCalendar(displayDate, schedulesCache);
  });

  fetchAndRender();

  // === Form Submission ===
  const form = document.getElementById("scheduleForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const date = document.getElementById("date").value;
      const day = document.getElementById("day").value;

      fetch("http://localhost:3001/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, day })
      })
        .then(res => res.json())
        .then(() => location.reload())
        .catch(err => console.error("Failed to add schedule:", err));
    });
  }
});

// === Edit Schedule Overlay Logic ===
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("editScheduleOverlay");
  const iframe = document.getElementById("editScheduleIframe");
  const openBtn = document.getElementById("editBtn");
  const closeBtn = document.getElementById("closeEditSchedule");

  openBtn?.addEventListener("click", () => {
    overlay.style.display = "flex";
    iframe.src = "edit-sched.html";
  });

  closeBtn?.addEventListener("click", () => {
    overlay.style.display = "none";
    iframe.src = "";
  });

  window.addEventListener("message", (event) => {
    if (event.data?.type === "scheduleUpdated") {
      overlay.style.display = "none";
      iframe.src = "";
      location.reload(); // or call fetchAndRender();
    }
  });
});
