/* Simple vanilla-JS carousel logic */
const slides = Array.from(document.querySelectorAll(".slide"));
let current = 0;

const updateSlides = () => {
  slides.forEach((s, i) => s.classList.toggle("active", i === current));
};

// ----- NAV BUTTONS -----
document.getElementById("prevBtn").addEventListener("click", () => {
  current = (current - 1 + slides.length) % slides.length;
  updateSlides();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  current = (current + 1) % slides.length;
  updateSlides();
});

// Optional: auto-advance every 7 s
setInterval(() => {
  current = (current + 1) % slides.length;
  updateSlides();
}, 9000);


// ----- PEEK PANEL -----
function togglePeek() {
  const panel = document.getElementById("peekPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}
