document.getElementById("addAppointmentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const patient_name = document.getElementById("patientName").value.trim();
    const visit_type = document.getElementById("visitType").value.trim();
    const appointment_date = document.getElementById("date").value;
    const appointment_time = document.getElementById("time").value;
    const status = "Confirmed"; 
    
    if (!patient_name || !visit_type || !appointment_date || !appointment_time) {
        alert(" Please fill in all fields.");
        return;
    }

    console.log("Sending appointment data:", { patient_name, visit_type, appointment_date, appointment_time, status });

    try {
        const response = await fetch("http://localhost:3000/appointments/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patient_name, visit_type, appointment_date, appointment_time, status }),
        });

        const data = await response.json();
        console.log("Server Response:", data);

        if (response.ok) {
            console.log("Appointment added successfully!");
            // ✅ send real appointment_date back to parent
            window.parent.postMessage({ type: "appointmentAdded", date: appointment_date }, "*");
            window.parent.document.getElementById("addAppointmentOverlay").style.display = "none";
            document.getElementById("addAppointmentForm").reset();
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error adding appointment:", error);
        alert("Failed to add appointment.");
    }
});
