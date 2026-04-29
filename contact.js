// contact.js

document.addEventListener("DOMContentLoaded", () => {

  const sendBtn = document.getElementById("sendBtn");
  if (!sendBtn) return;

  sendBtn.addEventListener("click", () => {
    const name    = document.getElementById("cName")?.value.trim();
    const email   = document.getElementById("cEmail")?.value.trim();
    const subject = document.getElementById("cSubject")?.value.trim();
    const message = document.getElementById("cMessage")?.value.trim();

    if (!name || !email || !subject || !message) {
      window.showToast("Please fill in all fields ❌", true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      window.showToast("Please enter a valid email ❌", true);
      return;
    }

    // Clear form
    document.getElementById("cName").value = "";
    document.getElementById("cEmail").value = "";
    document.getElementById("cSubject").value = "";
    document.getElementById("cMessage").value = "";

    window.showToast("Message sent successfully ✓");
  });

  // Enter key moves between inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, i) => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && i < inputs.length - 1) {
        e.preventDefault();
        inputs[i + 1].focus();
      }
    });
  });
});