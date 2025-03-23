document.getElementById("patientFormFields").addEventListener("submit", function (event) {
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
    address: document.getElementById("address").value,

    // Updated Guardian Fields
    guardian_name: document.getElementById("guardian_name").value.trim(),
    guardian_gender: document.getElementById("guardian_gender").value,
    guardian_relationship: document.getElementById("guardian_relationship").value.trim(),
    guardian_contact: document.getElementById("guardian_contact").value,
    guardian_address: document.getElementById("guardian_address").value
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
        window.parent.postMessage("patientAdded", "*");
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
