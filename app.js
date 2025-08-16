// ===== Theme: persist light/dark =====
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.classList.toggle("light", savedTheme === "light");

const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const nowLight = !root.classList.contains("light");
    root.classList.toggle("light", nowLight);
    localStorage.setItem("theme", nowLight ? "light" : "dark");
  });
}

// ===== Mobile menu =====
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

// ===== Year in footer =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Smooth scroll + active link highlight (scrollspy) =====
const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];
const linkById = {};
navLinks.forEach(link => {
  const id = link.getAttribute("href")?.replace("#", "");
  if (id) linkById[id] = link;
});

// Use IntersectionObserver to set .active on the correct nav link
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = linkById[id];
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
);
sections.forEach(s => spy.observe(s));

// ===== Reveal-on-scroll =====
const revealEls = [];
document.querySelectorAll(".section, .card, .project, .titem, .about-card, .highlights li")
  .forEach(el => { el.classList.add("reveal"); revealEls.push(el); });

const revObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

revealEls.forEach(el => revObs.observe(el));

// ===== Contact form (mailto demo) =====
function contactSubmit(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const status = document.getElementById("formStatus");
  if (status) status.textContent = "Sending…";

  const subject = encodeURIComponent("Portfolio contact from " + data.name);
  const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`);
  window.location.href = `mailto:chetanak1005@gmail.com?subject=${subject}&body=${body}`;

  setTimeout(() => { if (status) status.textContent = "Opened your email client. Thanks!"; }, 500);
  form.reset();
  return false;
}
window.contactSubmit = contactSubmit;
