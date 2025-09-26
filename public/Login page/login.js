document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const errorBox = document.getElementById("error");
  const loginBtn = document.getElementById("loginBtn");
  const passwordInput = document.getElementById("password-field");
  const togglePassword = document.getElementById("togglePassword");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value.trim();

    errorBox.textContent = "";

    if (!email || !password) {
      errorBox.textContent = "Please enter both email and password.";
      errorBox.style.color = "red";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errorBox.textContent = "Invalid email format.";
      errorBox.style.color = "red";
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      errorBox.textContent =
        "Password must be at least 6 characters, include uppercase, lowercase, number, and special character.";
      errorBox.style.color = "red";
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        errorBox.textContent = "Login successful!";
        errorBox.style.color = "green";
        localStorage.setItem("token", data.token);
        window.location.href = "../../index.html";
      } else {
        errorBox.textContent = data.msg || "Invalid credentials";
        errorBox.style.color = "red";
      }
    } catch (err) {
      console.error("Error:", err);
      errorBox.textContent = "Server error. Please try again later.";
      errorBox.style.color = "red";
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  });

  // 🔑 Toggle Password
  togglePassword.classList.add("fa-eye-slash");
  togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.classList.replace("fa-eye-slash", "fa-eye");
    } else {
      passwordInput.type = "password";
      togglePassword.classList.replace("fa-eye", "fa-eye-slash");
    }
  });
});
