document.addEventListener("DOMContentLoaded", () => {
  const patientBtn = document.getElementById("patientbtn");
  const dashboardBtn = document.getElementById("dashboardbtn");
  const appointmentBtn = document.getElementById("appointmentbtn");
  const laboratoryBtn = document.getElementById("laboratorybtn");
  const prescriptionBtn = document.getElementById("prescriptionbtn");

  if (patientBtn) patientBtn.addEventListener("click", () => window.location.href = "patients.html");
  if (dashboardBtn) dashboardBtn.addEventListener("click", () => window.location.href = "index.html");
  if (appointmentBtn) appointmentBtn.addEventListener("click", () => window.location.href = "appointments.html");
  if (laboratoryBtn) laboratoryBtn.addEventListener("click", () => window.location.href = "laboratory.html");
  if (prescriptionBtn) prescriptionBtn.addEventListener("click", () => window.location.href = "prescriptions.html");

  const openBloodChemBtn = document.getElementById("openBloodChemBtn");
  const openLabChecklistBtn = document.getElementById("openLabChecklistBtn");
  const labOverlay = document.getElementById("labOverlay");
  const labIframe = document.getElementById("labIframe");
  const closeOverlayBtn = document.getElementById("closeOverlayBtn");

  if (openBloodChemBtn && labOverlay && labIframe) {
    openBloodChemBtn.addEventListener("click", () => {
      console.log("Opening Blood Chemistry Form");
      labIframe.src = "forms/blood-chemistry.html";
      labOverlay.classList.add("show");
    });
  }

  if (openLabChecklistBtn && labOverlay && labIframe) {
    openLabChecklistBtn.addEventListener("click", () => {
      labIframe.src = "forms/lab-checklist.html";
      labOverlay.classList.add("show");
    });
  }

  if (closeOverlayBtn && labOverlay && labIframe) {
    closeOverlayBtn.addEventListener("click", () => {
      labOverlay.classList.remove("show");
      labIframe.src = "";
    });
  }

  const patientInput = document.getElementById("patientName");
  const patientIdInput = document.getElementById("patientId");
  const suggestionBox = document.getElementById("customSuggestions");

  if (patientInput && suggestionBox && patientIdInput) {
    patientInput.addEventListener("input", function () {
      const query = this.value.trim();
      suggestionBox.innerHTML = "";

      if (query.length < 2) return;

      fetch(`http://localhost:3001/patients/search?name=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) return;

          data.forEach(patient => {
            const item = document.createElement("div");
            item.textContent = patient.name;
            item.dataset.id = patient.id;
            suggestionBox.appendChild(item);

            item.addEventListener("click", () => {
              patientInput.value = patient.name;
              patientIdInput.value = patient.id;
              suggestionBox.innerHTML = "";
            
              fetch(`http://localhost:3001/patients/${patient.id}`)
                .then(res => res.json())
                .then(data => {
                  const ageInput = document.getElementById("age");
                  const sexInput = document.getElementById("sex");
            
                  if (ageInput && data.Age) ageInput.value = data.Age;
                  if (sexInput && data.Gender) sexInput.value = data.Gender;
                })
                .catch(err => console.error("Error fetching patient info:", err));
            });            
          });
        })
        .catch(err => {
          console.error("Autocomplete fetch error:", err);
        });
    });

    document.addEventListener("click", (e) => {
      if (!suggestionBox.contains(e.target) && e.target !== patientInput) {
        suggestionBox.innerHTML = "";
      }
    });
  }

  const dateField = document.getElementById("dateField");
  if (dateField) {
    const today = new Date().toISOString().split("T")[0];
    dateField.value = today;
  }
});


