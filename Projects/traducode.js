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

/* ─── Swiper instance for TraduCode feature slider ─── */
const tcSwiper = new Swiper('.tcSwiper', {
  loop: true,
  speed: 600,
  grabCursor: true,
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  pagination: { el: '.swiper-pagination', clickable: true },
});

// Initialize Quotes Carousel
const quoteSwiper = new Swiper('.mySwiper', {
    loop: true,
    autoplay: {
        delay: 9000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});



// ----- PEEK PANEL -----
function togglePeek() {
  const panel = document.getElementById("peekPanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}
