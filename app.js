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

// ===== Mobile overlay menu (<= 820px) =====
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

function openMenu() {
  nav.classList.add("open");
  document.body.classList.add("no-scroll");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
}
function closeMenu() {
  nav.classList.remove("open");
  document.body.classList.remove("no-scroll");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.contains("open") ? closeMenu() : openMenu();
  });
  // Close when a link is clicked
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  // Escape to close
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  // If resized to desktop while open, reset
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 820 && nav.classList.contains("open")) closeMenu();
  });
}

// ===== Year in footer =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Smooth scroll with sticky header offset =====
const header = document.getElementById("header");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollWithOffset(targetEl) {
  if (!targetEl) return;
  const offset = (header?.offsetHeight || 0) + 12;
  const y = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: Math.max(0, y), behavior: prefersReduced ? "auto" : "smooth" });
}

// Intercept nav/back-to-top links
document.querySelectorAll('a[data-nav], a.backtotop').forEach(link => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    const id = href.slice(1);
    const target = document.getElementById(id);
    closeMenu();
    scrollWithOffset(target);
    history.replaceState(null, "", href);
  });
});

// ===== Active link highlight (scroll spy) =====
const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];
const linkById = {};
navLinks.forEach(link => {
  const id = link.getAttribute("href")?.replace("#", "");
  if (id) linkById[id] = link;
});

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = linkById[id];
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, {
    rootMargin: `-${(header?.offsetHeight || 0) + 40}px 0px -55% 0px`,
    threshold: 0.1
  });
  sections.forEach(s => spy.observe(s));
}

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(".section, .card, .project, .titem, .about-card, .badges li");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach(el => el.classList.add("in"));
} else if ("IntersectionObserver" in window) {
  const revObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealTargets.forEach(el => {
    el.classList.add("reveal");
    revObs.observe(el);
  });
} else {
  revealTargets.forEach(el => el.classList.add("in"));
}

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

