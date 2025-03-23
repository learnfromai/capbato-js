document
  .getElementById("patientFormFields")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const lastname = document.getElementById("lastname").value.trim();

    if (!lastname) {
      alert("⚠️ Last name is required.");
      return;
    }

    const patientData = {
      lastname,
      firstname: document.getElementById("firstname").value.trim(),
      middlename: document.getElementById("middlename").value.trim(),
      dob: document.getElementById("dob").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      contact: document.getElementById("contact").value,
      marital_status: document.getElementById("marital_status").value,
      occupation: document.getElementById("occupation").value,
      weight: document.getElementById("weight").value,
      height: document.getElementById("height").value,
      address: document.getElementById("address").value,
      r_lastname: document.getElementById("r_lastname").value.trim(),
      r_firstname: document.getElementById("r_firstname").value.trim(),
      r_middlename: document.getElementById("r_middlename").value.trim(),
      r_dob: document.getElementById("r_dob").value,
      r_age: document.getElementById("r_age").value,
      r_contact: document.getElementById("r_contact").value,
      relationship: document.getElementById("relationship").value,
      r_address: document.getElementById("r_address").value,
    };

    console.log("📤 Sending Data:", patientData);

    fetch("http://localhost:3000/patients/add-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Server Response:", data);

        if (data.message) {
          // Notify parent window (patients.html)
          window.parent.postMessage("patientAdded", "*");

          // Close modal if used inside iframe/modal
          const overlay = window.parent.document.getElementById("overlay");
          if (overlay) overlay.style.display = "none";

          document.getElementById("patientFormFields").reset();
        } else {
          alert(data.error || "❌ Failed to add patient.");
        }
      })
      .catch((error) => {
        console.error("❌ Error:", error);
        alert("Something went wrong. Please try again.");
      });
  });
