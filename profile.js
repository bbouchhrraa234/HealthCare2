// profile.js

document.addEventListener("DOMContentLoaded", () => {

  /* ── AUTH GUARD ── */
  function getUser() {
    try { return JSON.parse(localStorage.getItem("hc_user")); } catch { return null; }
  }

  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  /* ── POPULATE USER INFO ── */
  async function loadUserData() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) throw new Error();

    localStorage.setItem("hc_user", JSON.stringify(data));

    document.getElementById("sidebarName").textContent = data.name;
    document.getElementById("sidebarEmail").textContent = data.email;

    document.getElementById("fieldName").value = data.name;
    document.getElementById("fieldEmail").value = data.email;
    document.getElementById("fieldPhone").value = data.phone || "";
    document.getElementById("fieldLocation").value = data.location || "";

    updateAvatarInitials(data.name, data.photo);

  } catch {
    window.location.href = "login.html";
  }
      }

  function updateAvatarInitials(name, photo) {
    const mainAvatar   = document.getElementById("profileAvatar");
    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const initial = name ? name[0].toUpperCase() : "U";

    if (photo) {
      if (mainAvatar) mainAvatar.innerHTML = `<img src="${photo}" alt="avatar">`;
      if (sidebarAvatar) sidebarAvatar.innerHTML = `<img src="${photo}" alt="avatar">`;
    } else {
      if (mainAvatar) mainAvatar.innerHTML = `<span style="font-size:2rem;font-weight:700;color:var(--teal);">${initial}</span>`;
      if (sidebarAvatar) sidebarAvatar.textContent = initial;
    }

    // Also update navbar avatar
    const navCircle = document.querySelector(".nav-profile-btn .avatar-circle");
    const navUname  = document.querySelector(".nav-profile-btn .nav-uname");
    if (navCircle) navCircle.textContent = initial;
    if (navUname && name) navUname.textContent = name.split(" ")[0];
  }

  loadUserData();

  /* ── PHOTO UPLOAD ── */
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const fileInput      = document.getElementById("fileInput");

  changePhotoBtn?.addEventListener("click", () => fileInput?.click());

  fileInput?.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const u = getUser();
      u.photo = e.target.result;
      localStorage.setItem("hc_user", JSON.stringify(u));
      updateAvatarInitials(u.name, u.photo);
      window.showToast("Profile photo updated ✓");
    };
    reader.readAsDataURL(file);
  });

  /* ── SAVE PROFILE ── */
  document.getElementById("profileForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = getUser();
    u.name     = document.getElementById("fieldName").value.trim();
    u.email    = document.getElementById("fieldEmail").value.trim();
    u.phone    = document.getElementById("fieldPhone").value.trim();
    u.location = document.getElementById("fieldLocation").value.trim();
    localStorage.setItem("hc_user", JSON.stringify(u));
    loadUserData();
    window.showToast("Profile saved successfully ✓");
  });

  /* ── CHANGE PASSWORD ── */
  const savePwBtn = document.getElementById("savePwBtn");
  const pwMsg     = document.getElementById("pwMsg");

  savePwBtn?.addEventListener("click", () => {
    const oldPw     = document.getElementById("oldPw").value;
    const newPw     = document.getElementById("newPw").value;
    const confirmPw = document.getElementById("confirmPw").value;
    const u         = getUser();

    pwMsg.style.color = "#dc2626";

    if (!oldPw || !newPw || !confirmPw) { pwMsg.textContent = "Please fill all fields ❌"; return; }
    if (oldPw !== u.password) { pwMsg.textContent = "Current password is incorrect ❌"; return; }
    if (newPw.length < 6) { pwMsg.textContent = "New password must be at least 6 characters ⚠"; return; }
    if (newPw !== confirmPw) { pwMsg.textContent = "Passwords do not match ❌"; return; }

    u.password = newPw;
    await fetch("/api/user/profile", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
  },
  body: JSON.stringify({
    name: u.name,
    email: u.email,
    phone: u.phone,
    location: u.location
  })
});
    pwMsg.style.color = "#0f766e";
    pwMsg.textContent = "Password updated successfully ✓";
    document.getElementById("oldPw").value = "";
    document.getElementById("newPw").value = "";
    document.getElementById("confirmPw").value = "";
    window.showToast("Password updated ✓");
  });

  /* ── PASSWORD TOGGLE ── */
  document.querySelectorAll(".toggle-pw").forEach(icon => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling;
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  });

  /* ── NOTIFICATIONS ── */
  let notifications = [
    { id: 1, text: "📌 Appointment with Dr. Ahmed confirmed" },
    { id: 2, text: "💊 New prescription added to your records" },
    { id: 3, text: "🩺 Dr. Sara replied to your message" },
  ];

  function renderNotifications() {
    const list  = document.getElementById("notifList");
    const badge = document.getElementById("notifBadge");
    if (!list) return;

    list.innerHTML = "";

    if (notifications.length === 0) {
      list.innerHTML = `<div class="notif-empty"><i class="fas fa-bell-slash" style="font-size:2rem;color:var(--border);display:block;margin-bottom:12px;"></i>No notifications</div>`;
    } else {
      notifications.forEach(n => {
        const div = document.createElement("div");
        div.className = "notif-item";
        div.innerHTML = `<span>${n.text}</span><button class="notif-delete" data-id="${n.id}"><i class="fas fa-times"></i></button>`;
        list.appendChild(div);
      });
    }

    if (badge) {
      badge.textContent = notifications.length;
      badge.style.display = notifications.length ? "" : "none";
    }
  }

  document.getElementById("notifList")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".notif-delete");
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    notifications = notifications.filter(n => n.id !== id);
    renderNotifications();
  });

  document.getElementById("clearNotifBtn")?.addEventListener("click", () => {
    notifications = [];
    renderNotifications();
    window.showToast("All notifications cleared");
  });

  renderNotifications();

  /* ── SIDEBAR NAVIGATION ── */
  document.querySelectorAll(".sidebar-item[data-section]").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const section = item.dataset.section;

      // Update active sidebar
      document.querySelectorAll(".sidebar-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      // Show panel
      document.querySelectorAll(".content-panel").forEach(p => p.classList.remove("active"));
      document.getElementById("panel-" + section)?.classList.add("active");
    });
  });

  /* ── LOGOUT ── */
  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("hc_user");
localStorage.removeItem("token");
    window.showToast("Logged out successfully");
    setTimeout(() => { window.location.href = "index.html"; }, 900);
  });

});
