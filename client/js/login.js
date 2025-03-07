document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role"); // ✅ Get role from URL

  if (!role) {
      document.getElementById("message").textContent = "Invalid role selection.";
      return;
  }

  document.getElementById("loginForm").addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
          const response = await fetch("http://localhost:3000/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password, role }) // ✅ Send role to server
          });

          const data = await response.json();
          document.getElementById("message").textContent = data.message;

          if (response.ok) {
              if (role === "admin") {
                  window.location.href = "admin_dashboard.html";
              } else if (role === "receptionist") {
                  window.location.href = "index.html";
              } else if (role === "doctor") {
                  window.location.href = "doctor_dashboard.html";
              }
          }
      } catch (error) {
          console.error("Login Error:", error);
          document.getElementById("message").textContent = "Login failed.";
      }
  });
});
