const buttons = {
  patientbtn: "patients.html",
  dashboardbtn: "index.html",
  appointmentbtn: "appointments.html",
  laboratorybtn: "laboratory.html",
  prescriptionbtn: "prescriptions.html",
  schedulebtn: "doctor-schedule.html"
};

document.addEventListener("DOMContentLoaded", function () {
  // Role & Username Display
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

  // Navigation Setup
  Object.entries(buttons).forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = url;
      });
    }
  });

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  const tableBody = document.getElementById("prescriptionsTableBody");

  if (searchInput && tableBody) {
    searchInput.addEventListener("input", function() {
      const searchTerm = this.value.toLowerCase();
      const rows = tableBody.getElementsByTagName("tr");

      Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? "" : "none";
      });
    });
  }

  // Add Prescription Overlay
  const addPrescriptionBtn = document.getElementById("addPrescriptionBtn");
  const addPrescriptionOverlay = document.getElementById("addPrescriptionOverlay");
  const addPrescriptionIframe = document.getElementById("addPrescriptionIframe");
  const closeAddPrescription = document.getElementById("closeAddPrescription");

  if (addPrescriptionBtn && addPrescriptionOverlay) {
    addPrescriptionBtn.addEventListener("click", () => {
      addPrescriptionOverlay.style.display = "flex";
      // addPrescriptionIframe.src = "add-prescription-form.html"; // You can create this form later
      showToast("Add Prescription form will be implemented soon!", "info");
    });
  }

  if (closeAddPrescription && addPrescriptionOverlay) {
    closeAddPrescription.addEventListener("click", () => {
      addPrescriptionOverlay.style.display = "none";
      if (addPrescriptionIframe) {
        addPrescriptionIframe.src = "";
      }
    });
  }

  // Action buttons functionality
  const actionButtons = document.querySelectorAll(".action-btn");
  actionButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      const action = this.classList.contains("view-btn") ? "view" : 
                    this.classList.contains("edit-btn") ? "edit" : "delete";
      const row = this.closest("tr");
      const prescriptionId = row.cells[0].textContent;

      switch(action) {
        case "view":
          showToast(`Viewing prescription ${prescriptionId}`, "info");
          break;
        case "edit":
          showToast(`Editing prescription ${prescriptionId}`, "info");
          break;
        case "delete":
          showConfirmationModal(`Are you sure you want to delete prescription ${prescriptionId}?`, () => {
            // Delete logic here
            row.remove();
            showToast(`Prescription ${prescriptionId} deleted successfully!`, "success");
          });
          break;
      }
    });
  });

  // Confirmation Modal
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  let confirmCallback = null;

  function showConfirmationModal(message, callback) {
    const confirmationText = document.getElementById("confirmationText");
    if (confirmationText) {
      confirmationText.textContent = message;
    }
    confirmationModal.classList.remove("hidden");
    confirmCallback = callback;
  }

  if (confirmYes) {
    confirmYes.addEventListener("click", () => {
      confirmationModal.classList.add("hidden");
      if (confirmCallback) {
        confirmCallback();
        confirmCallback = null;
      }
    });
  }

  if (confirmNo) {
    confirmNo.addEventListener("click", () => {
      confirmationModal.classList.add("hidden");
      confirmCallback = null;
    });
  }

  // Toast notification
  function showToast(message, type = "success") {
    const toast = document.getElementById("toastNotification");
    const toastMessage = document.getElementById("toastMessage");
    
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.remove("hidden", "error");
      
      if (type === "error") {
        toast.classList.add("error");
      }
      
      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3000);
    }
  }

  // Close overlay when clicking outside
  if (addPrescriptionOverlay) {
    addPrescriptionOverlay.addEventListener("click", function(e) {
      if (e.target === addPrescriptionOverlay) {
        addPrescriptionOverlay.style.display = "none";
        if (addPrescriptionIframe) {
          addPrescriptionIframe.src = "";
        }
      }
    });
  }

  // Close modal when clicking outside
  if (confirmationModal) {
    confirmationModal.addEventListener("click", function(e) {
      if (e.target === confirmationModal) {
        confirmationModal.classList.add("hidden");
        confirmCallback = null;
      }
    });
  }
});
