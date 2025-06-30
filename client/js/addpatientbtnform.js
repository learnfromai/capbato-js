document.addEventListener('DOMContentLoaded', function() {
  const contactInput = document.getElementById('contact');
  const guardianContactInput = document.getElementById('guardian_contact');
  
  // Setup phone validation using utility functions
  setupPhoneValidation(contactInput);
  setupPhoneValidation(guardianContactInput);
});

document.getElementById("patientFormFields").addEventListener("submit", function (event) {
  event.preventDefault();

  const lastname = document.getElementById("lastname").value.trim();
  if (!lastname) {
    alert("Last name is required.");
    return;
  }

  // Validate address components
  const requiredAddressFields = [
    { id: "house_no", name: "House No." },
    { id: "street_name", name: "Street Name" },
    { id: "barangay", name: "Barangay" },
    { id: "city", name: "City/Municipality" },
    { id: "province", name: "Province" }
  ];

  const requiredGuardianAddressFields = [
    { id: "guardian_house_no", name: "Guardian House No." },
    { id: "guardian_street_name", name: "Guardian Street Name" },
    { id: "guardian_barangay", name: "Guardian Barangay" },
    { id: "guardian_city", name: "Guardian City/Municipality" },
    { id: "guardian_province", name: "Guardian Province" }
  ];

  // Check patient address fields
  for (const field of requiredAddressFields) {
    const value = document.getElementById(field.id).value.trim();
    if (!value) {
      alert(`${field.name} is required.`);
      return;
    }
  }

  // Check guardian address fields
  for (const field of requiredGuardianAddressFields) {
    const value = document.getElementById(field.id).value.trim();
    if (!value) {
      alert(`${field.name} is required.`);
      return;
    }
  }

  // Validate all phone inputs using utility function
  const phoneErrors = validateAllPhoneInputs(this);
  if (phoneErrors.length > 0) {
    alert(phoneErrors.join('\n'));
    return;
  }

  // Function to combine address components into a full address
  function combineAddress(houseNo, streetName, barangay, city, province) {
    const components = [houseNo, streetName, barangay, city, province]
      .map(component => component ? component.trim() : '')
      .filter(component => component.length > 0);
    return components.join(', ');
  }

  // Collect address components
  const patientAddress = combineAddress(
    document.getElementById("house_no").value,
    document.getElementById("street_name").value,
    document.getElementById("barangay").value,
    document.getElementById("city").value,
    document.getElementById("province").value
  );

  const guardianAddress = combineAddress(
    document.getElementById("guardian_house_no").value,
    document.getElementById("guardian_street_name").value,
    document.getElementById("guardian_barangay").value,
    document.getElementById("guardian_city").value,
    document.getElementById("guardian_province").value
  );

  const patientData = {
    lastname,
    firstname: document.getElementById("firstname").value.trim(),
    middlename: document.getElementById("middlename").value.trim(),
    dob: document.getElementById("dob").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    contact: document.getElementById("contact").value,
    address: patientAddress,

    guardian_name: document.getElementById("guardian_name").value.trim(),
    guardian_gender: document.getElementById("guardian_gender").value,
    guardian_relationship: document.getElementById("guardian_relationship").value.trim(),
    guardian_contact: document.getElementById("guardian_contact").value,
    guardian_address: guardianAddress
  };

  console.log("Sending Data:", patientData);

  fetch("http://localhost:3001/patients/add-patient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Server Response:", data);
      if (data.message) {
        window.parent.postMessage("patientAdded", "*");
        const overlay = window.parent.document.getElementById("overlay");
        if (overlay) overlay.style.display = "none";
        document.getElementById("patientFormFields").reset();
      } else {
        alert(data.error || "Failed to add patient.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    });
});

document.getElementById("dob").addEventListener("change", function () {
  const dobValue = this.value;
  if (dobValue) {
    const today = new Date();
    const birthDate = new Date(dobValue);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    document.getElementById("age").value = age >= 0 ? age : '';
  } else {
    document.getElementById("age").value = '';
  }
});
