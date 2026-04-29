// ==========================
// SIGN UP
// ==========================
const signupForm = signupForm.addEventListener("submit", async function(e) {;

if (signupForm) {
    const msg = signupForm.querySelector(".msg");

    // 👁️ show / hide password
    const toggles = signupForm.querySelectorAll(".toggle-pass");

    toggles.forEach(icon => {
    icon.addEventListener("click", () => {
        const input = icon.parentElement.querySelector("input");

        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
});

    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const inputs = signupForm.querySelectorAll("input");

        const name = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const password = inputs[2].value.trim();
        const confirm = inputs[3].value.trim();

        if (!name || !email || !password || !confirm) {
            showMessage(msg, "Please fill all fields ❌", "red");
            shake(signupForm);
            return;
        }

        if (password.length < 6) {
            showMessage(msg, "Password must be at least 6 characters ⚠", "red");
            shake(signupForm);
            return;
        }

        if (password !== confirm) {
            showMessage(msg, "Passwords do not match ❌", "red");
            shake(signupForm);
            return;
        }

        // Register via API
try {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('hc_user', JSON.stringify(data.user));
        
        showMessage(msg, "Account created successfully ✔", "green");
        
        setTimeout(() => {
            window.location.href = "profile.html";
        }, 800);
    } else {
        showMessage(msg, data.message || "Registration failed ❌", "red");
        shake(signupForm);
    }
} catch (error) {
    showMessage(msg, "Network error ❌", "red");
    shake(signupForm);
    }
    });
}

 // ==========================
// LOGIN
// ==========================
const loginForm = document.querySelector(".login-box");

if (loginForm) {
    const btn = loginForm.querySelector(".login-btn");
    const msg = document.createElement("p");
    msg.classList.add("msg");

    // 👁️ show / hide password (LOGIN)
    const toggle = loginForm.querySelector(".toggle-pass");

    if (toggle) {
        toggle.addEventListener("click", () => {
            const input = loginForm.querySelector("input[type='password'], input[type='text']");

            if (input.type === "password") {
                input.type = "text";
                toggle.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                toggle.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    }

    btn.addEventListener("click", async () => {
    const inputs = loginForm.querySelectorAll("input");

    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (!email || !password) {
        showMessage(msg, "Fill all fields ❌", "red");
        loginForm.appendChild(msg);
        shake(loginForm);
        return;
    }

    // Login via API
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('hc_user', JSON.stringify(data.user));
            
            showMessage(msg, "Login successful ✔", "green");
            loginForm.appendChild(msg);
            
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 700);
        } else {
            showMessage(msg, data.message || "Wrong email or password ❌", "red");
            loginForm.appendChild(msg);
            shake(loginForm);
        }
    } catch (error) {
        console.error("Login error:", error);
        showMessage(msg, "Network error ❌", "red");
        loginForm.appendChild(msg);
        shake(loginForm);
    }
});

  
}

// ==========================
// FORGOT PASSWORD
// ==========================
const forgotForm = document.querySelector(".forgot-box");

if (forgotForm) {
    const btn = forgotForm.querySelector(".reset-btn");
    const msg = document.createElement("p");
    msg.classList.add("msg");

    btn.addEventListener("click", async () => {
    const email = forgotForm.querySelector("input").value.trim();

    if (!email) {
        showMessage(msg, "Enter your email ❌", "red");
        forgotForm.appendChild(msg);
        shake(forgotForm);
        return;
    }

    // Forgot password via API
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(msg, "Reset link sent to your email 📧", "green");
        } else {
            showMessage(msg, data.message || "Email not found ❌", "red");
            shake(forgotForm);
        }
    } catch (error) {
        console.error("Forgot password error:", error);
        showMessage(msg, "Network error ❌", "red");
        shake(forgotForm);
    }

    forgotForm.appendChild(msg);
});
}

// ==========================
// FUNCTIONS (Reusable)
// ==========================

// show message
function showMessage(element, text, color) {
    element.textContent = text;
    element.style.color = color;
}

// shake animation
function shake(element) {
    element.classList.add("shake");
    setTimeout(() => element.classList.remove("shake"), 300);
}
