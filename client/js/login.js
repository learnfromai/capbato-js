document.addEventListener("DOMContentLoaded", function () {
  let role;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("role")) {
    role = urlParams.get("role");
  } else {
    const roleInput = document.getElementById("role");
    if (roleInput) {
      role = roleInput.value;
    }
  }

  if (!role) {
    const messageEl = document.getElementById("message");
    if (messageEl) {
      messageEl.textContent = "Invalid role selection.";
    }
    return;
  }

  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        document.getElementById("message").textContent = data.message || "Login failed.";
        return;
      }

      // ✅ Clear message and store role
      document.getElementById("message").textContent = "";
      localStorage.setItem("loggedInRole", role);

      // ✅ Redirect based on role
      if (role === "admin") {
        window.location.href = "admin_dashboard.html";
      } else if (role === "receptionist") {
        window.location.href = "index.html";
      } else if (role === "doctor") {
        window.location.href = "doctor_dashboard.html";
      }
    } catch (error) {
      console.error("Login Error:", error);
      document.getElementById("message").textContent = "Login failed.";
    }
  });

  // ✅ Handle "Go Back" button click
  const goBackBtn = document.getElementById("goBackBtn");
  if (goBackBtn) {
    goBackBtn.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }
});
