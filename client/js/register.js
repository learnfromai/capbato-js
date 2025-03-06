function goToLogin() {
  window.location.href = "login.html";
}

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, username, password }),
    });

    const data = await response.json();
    document.getElementById("message").textContent = data.message;

    if (response.ok) {
      setTimeout(() => (window.location.href = "login.html"), 2000);
    }
  });
