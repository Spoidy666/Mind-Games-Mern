const signupForm = document.getElementById('signupForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        confirmPasswordInput.style.borderBottom = "2px solid red";
        return;
    }

    try {
        const response = await fetch("/signup", { // <-- relative URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        alert(data.message);
        signupForm.reset();
        confirmPasswordInput.style.borderBottom = "2px solid #fff";
    } catch (err) {
        alert("Error connecting to server!");
        console.error(err);
    }
});

// Real-time check for password match
confirmPasswordInput.addEventListener('input', function() {
    if (confirmPasswordInput.value.trim() !== passwordInput.value.trim()) {
        confirmPasswordInput.style.borderBottom = "2px solid red";
    } else {
        confirmPasswordInput.style.borderBottom = "2px solid limegreen";
    }
});