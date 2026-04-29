// heropage.js

document.addEventListener("DOMContentLoaded", () => {

  // ── SEARCH VALIDATION ──
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const specialty = document.getElementById("specialtySelect");
      const location  = document.getElementById("locationSelect");
      const date      = document.getElementById("dateInput");
      let valid = true;

      [specialty, location, date].forEach(el => {
        const empty = !el.value || (el.tagName === "SELECT" && el.selectedIndex === 0);
        el.style.borderColor = empty ? "#f87171" : "";
        if (empty) valid = false;
      });

      if (valid) {
        window.location.href = `doctors.html?specialty=${specialty.value}&location=${location.value}&date=${date.value}`;
      } else {
        window.showToast("Please fill all search fields!", true);
      }
    });
  }

  // ── SPECIALTY CARDS ──
  const specCards = document.querySelectorAll(".spec-card");
  specCards.forEach(card => {
    card.addEventListener("click", () => {
      specCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const specialty = card.getAttribute("data-specialty");
      const label     = card.querySelector("h4").textContent;

      const specialtySelect = document.getElementById("specialtySelect");
      if (specialtySelect && specialty !== "all") {
        // add option if not present
        let opt = [...specialtySelect.options].find(o => o.value === specialty);
        if (!opt) {
          opt = new Option(label, specialty);
          specialtySelect.add(opt);
        }
        specialtySelect.value = specialty;
        document.querySelector(".search-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  // ── UPDATE DRAWER AUTH ──
  function syncDrawerAuth() {
    const user = (() => {
      try { return JSON.parse(localStorage.getItem("hc_user")); } catch { return null; }
    })();
    const drawerLogin   = document.getElementById("drawer-login");
    const drawerProfile = document.getElementById("drawer-profile");
    if (!drawerLogin || !drawerProfile) return;
    if (user) {
      drawerLogin.style.display = "none";
      drawerProfile.style.display = "";
    } else {
      drawerLogin.style.display = "";
      drawerProfile.style.display = "none";
    }
  }
  syncDrawerAuth();
  window.addEventListener("storage", syncDrawerAuth);
});