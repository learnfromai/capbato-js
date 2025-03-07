document.getElementById("addAppointmentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const patientName = document.getElementById("patientName").value;
    const visitType = document.getElementById("visitType").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const status = document.getElementById("status").checked ? "Confirmed" : "Pending";

    try {
        const response = await fetch("http://localhost:3000/appointments/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patientName, visitType, date, time, status }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Appointment added successfully!");
            window.location.href = "appointments.html"; // Redirect back to the appointments list
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error adding appointment:", error);
        alert("Failed to add appointment.");
    }
});
