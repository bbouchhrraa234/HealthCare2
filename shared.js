// shared.js — navbar auth swap, mobile drawer, ripple, scroll reveal, toast

(function () {
  "use strict";

  /* ── AUTH STATE ── */
  function getUser() {
    try {
      const u = localStorage.getItem("hc_user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }

  function updateNavAuth() {
    const user = getUser();
    const loginEl = document.querySelector(".nav-btn-login");
    const profileEl = document.querySelector(".nav-profile-btn");

    if (!loginEl || !profileEl) return;

    if (user) {
      loginEl.style.display = "none";
      profileEl.style.display = "flex";
      const circle = profileEl.querySelector(".avatar-circle");
      const uname = profileEl.querySelector(".nav-uname");
      if (circle) circle.textContent = user.name ? user.name[0].toUpperCase() : "U";
      if (uname) uname.textContent = user.name ? user.name.split(" ")[0] : "Profile";
    } else {
      loginEl.style.display = "";
      profileEl.style.display = "none";
    }
  }

  /* ── ACTIVE NAV LINK ── */
  function setActiveLink() {
    const page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("active", href === page || href.includes(page));
    });
  }

  /* ── MOBILE DRAWER ── */
  function initDrawer() {
    const hamburger = document.querySelector(".nav-hamburger");
    const overlay = document.querySelector(".mobile-nav-overlay");
    const drawer = document.querySelector(".mobile-nav-drawer");
    const closeBtn = document.querySelector(".drawer-close");

    function open() {
      overlay && overlay.classList.add("open");
      drawer && drawer.classList.add("open");
    }

    function close() {
      overlay && overlay.classList.remove("open");
      drawer && drawer.classList.remove("open");
    }

    hamburger && hamburger.addEventListener("click", open);
    closeBtn && closeBtn.addEventListener("click", close);
    overlay && overlay.addEventListener("click", close);
  }

  /* ── RIPPLE ── */
  function initRipple() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("button, .nav-btn-login, .main-btn, .send-btn, .save-btn, .signup-btn, .login-btn-form, .reset-btn");
      if (!btn) return;
      const circle = document.createElement("span");
      circle.classList.add("ripple");
      const rect = btn.getBoundingClientRect();
      circle.style.left = e.clientX - rect.left - 50 + "px";
      circle.style.top = e.clientY - rect.top - 50 + "px";
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  }

  /* ── SCROLL REVEAL ── */
  function initReveal() {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
  }

  /* ── TOAST ── */
  window.showToast = function (msg, isError = false) {
    let toast = document.getElementById("shared-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "shared-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.className = "toast" + (isError ? " toast-error" : "");
    toast.innerHTML = `<i class="fas fa-${isError ? "exclamation-circle" : "check-circle"}"></i> ${msg}`;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
  };

  /* ── INIT ── */
  document.addEventListener("DOMContentLoaded", () => {
    updateNavAuth();
    setActiveLink();
    initDrawer();
    initRipple();
    initReveal();
  });

  // Re-check auth when storage changes (e.g. after login in another tab)
  window.addEventListener("storage", updateNavAuth);
})();