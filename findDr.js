// ===== SELECT SIDEBAR SPECIALTY =====
const specialties = document.querySelectorAll(".sidebar li");

specialties.forEach(item => {
    item.addEventListener("click", () => {
        specialties.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});


// ===== SEARCH FUNCTION (BY NAME) =====
const searchInput = document.querySelector(".search-box input");
const doctorCards = document.querySelectorAll(".card");

searchInput.addEventListener("keyup", () => {
    let value = searchInput.value.toLowerCase();

    doctorCards.forEach(card => {
        let name = card.querySelector("h4").textContent.toLowerCase();

        if (name.includes(value)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
});


// ===== SEARCH BUTTON CLICK (OPTIONAL EFFECT) =====
const searchBtn = document.querySelector(".search-box button");

searchBtn.addEventListener("click", () => {
    searchBtn.innerText = "Searching...";
    
    setTimeout(() => {
        searchBtn.innerText = "Search";
    }, 800);
});


// ===== VIEW PROFILE BUTTON CLICK =====
const profileButtons = document.querySelectorAll(".card button");

profileButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        alert("Opening doctor profile...");
        // later you can redirect:
        // window.location.href = "doctor-profile.html";
    });
});