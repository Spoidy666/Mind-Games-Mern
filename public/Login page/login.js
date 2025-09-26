document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const errorBox = document.getElementById("error");
  const loginBtn = document.getElementById("loginBtn");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent page reload

    // Get values from form
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
        errorBox.textContent = "Password must be at least 6 characters, include uppercase, lowercase, number, and special character.";
        errorBox.style.color = "red";
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";
    
    try {
      // Send data to backend
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
         localStorage.setItem("username", data.user.name);
      
        window.location.href = "../../index.html";
    } else {
        errorBox.textContent = data.msg || "Invalid credentials";
        errorBox.style.color = "red";
    }
    } catch (err) {
        console.error("Error:", err);
        errorBox.textContent = "Server error. Please try again later.";
        errorBox.style.color = "red";
    }finally {
        loginBtn.disabled = false;        
        loginBtn.textContent = "Login";  
    }
  });
});