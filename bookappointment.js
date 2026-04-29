// TIME SELECT
const times = document.querySelectorAll(".times button");

times.forEach(btn => {
    btn.addEventListener("click", () => {
        times.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});