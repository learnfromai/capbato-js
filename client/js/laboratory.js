document.getElementById("patientbtn").addEventListener("click", () => {
  window.location.href = "patients.html";
});

document.getElementById("dashboardbtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("appointmentbtn").addEventListener("click", () => {
  window.location.href = "appointments.html";
});

document.getElementById("laboratorybtn").addEventListener("click", () => {
  window.location.href = "laboratory.html";
});

document.getElementById("prescriptionbtn").addEventListener("click", () => {
  window.location.href = "prescriptions.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const openBloodChemBtn = document.getElementById("openBloodChemBtn");
  const openLabChecklistBtn = document.getElementById("openLabChecklistBtn");
  const labOverlay = document.getElementById("labOverlay");
  const labIframe = document.getElementById("labIframe");
  const closeOverlayBtn = document.getElementById("closeOverlayBtn");

  if (openBloodChemBtn) {
    openBloodChemBtn.addEventListener("click", () => {
      console.log("Opening Blood Chemistry Form");
      labIframe.src = "blood-chemistry.html";
      labOverlay.classList.add("show");
    });
  }

  if (openLabChecklistBtn) {
    openLabChecklistBtn.addEventListener("click", () => {
      labIframe.src = "lab-checklist.html";
      labOverlay.classList.add("show");
    });
  }

  if (closeOverlayBtn) {
    closeOverlayBtn.addEventListener("click", () => {
      labOverlay.classList.remove("show");
      labIframe.src = "";
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("loggedInRole");
  const display = document.getElementById("roleDisplay");
  if (display && role) {
    display.textContent = role.toUpperCase();
  }
});


