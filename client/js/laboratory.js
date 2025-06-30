// Navigation buttons
const buttons = {
  patientbtn: "patients.html",
  dashboardbtn: "index.html",
  appointmentbtn: "appointments.html",
  laboratorybtn: "laboratory.html",
  prescriptionbtn: "prescriptions.html",
  schedulebtn: "doctor-schedule.html"
};

Object.entries(buttons).forEach(([id, url]) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", () => window.location.href = url);
});

document.addEventListener("DOMContentLoaded", async () => {
  const addLabTestBtn = document.getElementById("addLabTestBtn");
  const labOverlay = document.getElementById("labOverlay");
  const labIframe = document.getElementById("labIframe");
  const closeOverlayBtn = document.getElementById("closeOverlayBtn");

  if (addLabTestBtn) {
    addLabTestBtn.addEventListener("click", () => {
      labIframe.src = "lab-request-form.html";
      labOverlay.classList.add("show");
    });
  }

  if (closeOverlayBtn) {
    closeOverlayBtn.addEventListener("click", () => {
      labOverlay.classList.remove("show");
      labIframe.src = "";
    });
  }

  window.addEventListener("message", (event) => {
    if (event.data.action === "closeLabOverlay") {
      document.getElementById("labOverlay").classList.remove("show");
      document.getElementById("labIframe").src = "";

      if (event.data.toastMessage) {
        showToast(event.data.toastMessage);
      }

      if (window._lastLabViewedMode === "view") {
        document.getElementById("labTestModal").classList.add("show");
      }

      if (window._lastLabViewedMode === "edit") {
        loadLabRequests();
      }

      if (event.data.actionType === "updateLabTable") {
        loadLabRequests(); // ✅ new addition
      }

      window._lastLabViewedMode = null;
    }
  });


  const role = localStorage.getItem("loggedInRole");
  const username = localStorage.getItem("loggedInUsername");

  const roleDisplay = document.getElementById("roleDisplay");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (role && roleDisplay) roleDisplay.textContent = role.toUpperCase();
  if (username && usernameDisplay) usernameDisplay.textContent = username;

  await loadLabRequests();

  const closeBtn = document.getElementById("closeLabTestModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("labTestModal").classList.remove("show");
    });
  }

  const yesBtn = document.getElementById("confirmCancelYes");
  const noBtn = document.getElementById("confirmCancelNo");

  if (yesBtn && noBtn) {
    yesBtn.addEventListener("click", () => {
      if (window._labTestToCancel) {
        window._labTestToCancel.querySelector(".lab-status").textContent = "Canceled";
        document.getElementById("cancelConfirmationModal").classList.add("hidden");
        window._labTestToCancel = null;
      }
    });

    noBtn.addEventListener("click", () => {
      document.getElementById("cancelConfirmationModal").classList.add("hidden");
      window._labTestToCancel = null;
    });
  }
});

async function loadLabRequests() {
  try {
    const res = await fetch("http://localhost:3001/api/lab_requests");
    const result = await res.json();

    const labResults = Array.isArray(result) ? result : (result?.rows || []);
    if (!Array.isArray(labResults)) {
      throw new Error("Expected an array of lab results");
    }

    renderLabResults([...labResults].reverse());
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function toTitleCase(str) {
  return (str || "")
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatFullName(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length < 2) return toTitleCase(name);
  const last = parts.pop();
  const first = parts.shift();
  const middle = parts.join(" ");
  return `${toTitleCase(last)}, ${toTitleCase(first)}${middle ? " " + toTitleCase(middle) : ""}`;
}

function renderLabResults(labResults) {
  const labResultsBody = document.getElementById("labResultsBody");
  labResultsBody.innerHTML = "";

  const groupings = {
    "ROUTINE": ["cbc_with_platelet", "pregnancy_test", "urinalysis", "fecalysis", "occult_blood_test"],
    "SEROLOGY & IMMUNOLOGY": ["hepa_b_screening", "hepa_a_screening", "hepatitis_profile", "vdrl_rpr", "dengue_ns1", "ca_125_cea_psa"],
    "BLOOD CHEMISTRY": ["fbs", "bun", "creatinine", "blood_uric_acid", "lipid_profile", "sgot", "sgpt", "alp", "sodium_na", "potassium_k", "hba1c"],
    "MISCELLANEOUS TEST": ["ecg"],
    "THYROID FUNCTION TEST": ["t3", "t4", "ft3", "ft4", "tsh"]
  };

  const labelMap = {
    cbc_with_platelet: "CBC with Platelet", pregnancy_test: "Pregnancy Test", urinalysis: "Urinalysis",
    fecalysis: "Fecalysis", occult_blood_test: "Occult Blood Test", hepa_b_screening: "Hepa B Screening",
    hepa_a_screening: "Hepa A Screening", hepatitis_profile: "Hepatitis Profile", vdrl_rpr: "VDRL/RPR",
    dengue_ns1: "Dengue NS1", ca_125_cea_psa: "CA 125 / CEA / PSA", fbs: "FBS", bun: "BUN",
    creatinine: "Creatinine", blood_uric_acid: "Blood Uric Acid", lipid_profile: "Lipid Profile",
    sgot: "SGOT", sgpt: "SGPT", alp: "ALP", sodium_na: "Sodium Na", potassium_k: "Potassium K+",
    hba1c: "HBA1C", ecg: "ECG", t3: "T3", t4: "T4", ft3: "FT3", ft4: "FT4", tsh: "TSH"
  };

  const grouped = {};

  labResults.forEach(result => {
    const key = result.patient_id || "-";
    if (!grouped[key]) {
      grouped[key] = {
        patient_id: key,
        patient_name: result.patient_name,
        tests: [],
        originalStatus: result.status // Store the original status from the database
      };
    }

    for (const [group, fields] of Object.entries(groupings)) {
      const selected = fields.filter(field => result[field] && result[field].toString().toLowerCase() !== "no");
      if (selected.length > 0) {
        grouped[key].tests.push({
          group,
          date: result.date,
          status: result.status || "Pending",
          testNames: selected.map(f => labelMap[f]),
          fieldKeys: selected
        });
      }
    }
  });

  Object.values(grouped).forEach(entry => {
    const formattedName = formatFullName(entry.patient_name);
    const row = document.createElement("tr");

    // Get the status - prefer from tests, fallback to original status, then "Pending"
    let displayStatus = "Pending";
    if (entry.tests && entry.tests.length > 0) {
      displayStatus = entry.tests[entry.tests.length - 1]?.status || "Pending";
    } else if (entry.originalStatus) {
      displayStatus = entry.originalStatus;
    }

    // Only show entries that have tests or show all entries (you can modify this logic)
    // For now, let's show all entries but handle empty tests gracefully
    const testsToDisplay = entry.tests && entry.tests.length > 0 ? entry.tests : [];

    row.innerHTML = `
      <td>${entry.patient_id}</td>
      <td>${formattedName}</td>
      <td class="lab-status">${displayStatus}</td>
      <td>
        <button class="btn btn-primary"
          data-patient-id="${entry.patient_id}"
          data-patient-name="${formattedName}"
          data-tests='${JSON.stringify(testsToDisplay)}'>View</button>
      </td>
    `;

    labResultsBody.appendChild(row);
  });
}

function formatDateToReadable(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("btn") && e.target.textContent === "View") {
    const row = e.target.closest("tr");
    const tests = JSON.parse(e.target.dataset.tests || "[]");
    const modal = document.getElementById("labTestModal");
    const tbody = document.getElementById("labTestModalBody");

    document.getElementById("labHeaderPatientId").textContent = row.children[0].textContent;
    document.getElementById("labHeaderPatientName").textContent = row.children[1].textContent;

    tbody.innerHTML = "";

    // Handle case where there are no tests
    if (!tests || tests.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td colspan="4" style="text-align: center; color: #666;">No test results available</td>
      `;
      tbody.appendChild(tr);
    } else {
      tests.forEach(({ group, testNames, date, status, fieldKeys }) => {
        const testsStr = testNames.join(", ");
        const tr = document.createElement("tr");

        tr.dataset.patientId = row.children[0].textContent;
        tr.dataset.patientName = row.children[1].textContent;
        tr.dataset.requestDate = date;
        tr.dataset.selectedTests = fieldKeys.join(",");

        const actionButtons = status.toLowerCase() === "complete"
          ? `<button class="btn btn-info btn-sm btn-view">View</button>
             <button class="btn btn-warning btn-sm btn-edit">Edit</button>`
          : `<button class="btn btn-success btn-sm add-result-btn">Add Result</button>
             <button class="btn btn-danger btn-sm btn-cancel">Cancel</button>`;

        tr.innerHTML = `
          <td>${group}: ${testsStr}</td>
          <td>${formatDateToReadable(date)}</td>
          <td class="lab-status">${status}</td>
          <td><div class="btn-group">${actionButtons}</div></td>
        `;

        tbody.appendChild(tr);
      });
    }

    modal.classList.add("show");
  }

  if (e.target && e.target.classList.contains("add-result-btn")) {
    const row = e.target.closest("tr");

    const lab = {
      patient_id: row.dataset.patientId,
      patient_name: row.dataset.patientName,
      request_date: row.dataset.requestDate,
      selectedTests: (row.dataset.selectedTests || "").split(",")
    };

    openLabOverlay({ ...lab, readOnly: false });
  }

  if (e.target && e.target.classList.contains("btn-cancel")) {
    window._labTestToCancel = e.target.closest("tr");
    document.getElementById("cancelConfirmationModal").classList.remove("hidden");
  }

  if (e.target && e.target.classList.contains("btn-view")) {
    const row = e.target.closest("tr");
    const lab = {
      patient_id: row.dataset.patientId,
      patient_name: row.dataset.patientName,
      request_date: row.dataset.requestDate,
      selectedTests: (row.dataset.selectedTests || "").split(","),
      readOnly: true
    };
    window._lastLabViewedMode = "view";
    document.getElementById("labTestModal").classList.remove("show");
    openLabOverlay(lab);
  }

  if (e.target && e.target.classList.contains("btn-edit")) {
    const row = e.target.closest("tr");
    const lab = {
      patient_id: row.dataset.patientId,
      patient_name: row.dataset.patientName,
      request_date: row.dataset.requestDate,
      selectedTests: (row.dataset.selectedTests || "").split(","),
      readOnly: false
    };
    window._lastLabViewedMode = "edit";
    document.getElementById("labTestModal").classList.remove("show");
    openLabOverlay(lab);
  }
});

function openLabOverlay(lab) {
  const iframe = document.getElementById("labIframe");
  const overlay = document.getElementById("labOverlay");

  // Map test fields to form files
  const formMap = {
    // ROUTINE
    urinalysis: "urinalysis.html",
    fecalysis: "fecalysis.html",

    // BLOOD CHEMISTRY
    fbs: "blood-chemistry.html", 

    // SEROLOGY
    hepa_b_screening: "serology-immunology.html",
    hepa_a_screening: "serology-immunology.html",
    hepatitis_profile: "serology-immunology.html",
    vdrl_rpr: "serology-immunology.html",
    dengue_ns1: "serology-immunology.html",
    ca_125_cea_psa: "serology-immunology.html",

    // HEMATOLOGY (e.g., CBC)
    cbc_with_platelet: "hematology.html"
  };

  // Determine which form to load based on first test field key
  // Add safety check for selectedTests
  const selectedKey = (lab.selectedTests && lab.selectedTests.length > 0) 
    ? lab.selectedTests[0] 
    : "fbs"; // default fallback
  const targetForm = formMap[selectedKey] || "blood-chemistry.html"; // fallback

  overlay.classList.add("show");
  iframe.src = targetForm;

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.postMessage({
        type: "openLabForm",
        ...lab
      }, "*");
    }, 100);
  };
}


function showToast(message, duration = 3000) {
  const toast = document.getElementById("labToast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, duration);
}
