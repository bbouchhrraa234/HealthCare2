// ==========================
// SIGN UP
// ==========================
const signupForm = document.getElementById("signupForm");

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

        // save user
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);

        showMessage(msg, "Account created successfully ✔", "green");

        setTimeout(() => {
            window.location.href = "profile.html";
        }, 800);
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

    btn.addEventListener("click", () => {
        const inputs = loginForm.querySelectorAll("input");

        const email = inputs[0].value.trim();
        const password = inputs[1].value.trim();

        const savedEmail = localStorage.getItem("userEmail");
        const savedPassword = localStorage.getItem("userPassword");

        if (!email || !password) {
            showMessage(msg, "Fill all fields ❌", "red");
            loginForm.appendChild(msg);
            shake(loginForm);
            return;
        }

      /* */ if (email === savedEmail && password === savedPassword) {
            showMessage(msg, "Login successful ✔", "green");
            loginForm.appendChild(msg);

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 700);

        } else {
            showMessage(msg, "Wrong email or password ❌", "red");
            loginForm.appendChild(msg);
            shake(loginForm);
            shake(forgotForm)
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

    btn.addEventListener("click", () => {
        const email = forgotForm.querySelector("input").value.trim();
        const savedEmail = localStorage.getItem("userEmail");
        const savedPassword = localStorage.getItem("userPassword");

        if (!email) {
            showMessage(msg, "Enter your email ❌", "red");
            forgotForm.appendChild(msg);
            shake(forgotForm);
            return;
        }

        if (email === savedEmail) {
            showMessage(msg, "Your password is: " + savedPassword, "green");
        } else {
            showMessage(msg, "Email not found ❌", "red");
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