/* =============================================
   Uzma Bibi — Portfolio
   portfolio-script.js
   ============================================= */

// ─── CUSTOM CURSOR ────────────────────────────
const cursor   = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top  = mouseY + "px";
});

// Smooth follower
(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + "px";
  follower.style.top  = followerY + "px";
  requestAnimationFrame(animateFollower);
})();

// Cursor scale on hover
document.querySelectorAll("a, button, .skill-card, .project-card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
    follower.style.transform = "translate(-50%, -50%) scale(1.5)";
    follower.style.borderColor = "#ff6b9d";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    follower.style.transform = "translate(-50%, -50%) scale(1)";
    follower.style.borderColor = "#00d4ff";
  });
});

// ─── NAVBAR SCROLL ────────────────────────────
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ─── MOBILE MENU ──────────────────────────────
const burger     = document.getElementById("burger");
const mobileMenu = document.getElementById("mobile-menu");
const mmLinks    = document.querySelectorAll(".mm-link");

burger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
  const spans = burger.querySelectorAll("span");
  if (mobileMenu.classList.contains("open")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity   = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  } else {
    spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
  }
});

mmLinks.forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    burger.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
  });
});

// ─── TYPED EFFECT ─────────────────────────────
const typedEl = document.getElementById("typed");
const phrases = [
  "Software Engineering Student",
  "Frontend Developer",
  "Web Enthusiast",
  "Problem Solver",
  "Creative Coder",
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let typePause = false;

function type() {
  const current = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting  = true;
      typePause = true;
      setTimeout(() => { typePause = false; }, 1800);
    }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }

  if (!typePause) {
    const speed = deleting ? 40 : 80;
    setTimeout(type, speed);
  } else {
    setTimeout(type, 1800);
  }
}

type();

// ─── SCROLL REVEAL ────────────────────────────
const revealEls = document.querySelectorAll(".reveal, .skill-card, .project-card, .timeline-item, .contact-card, .stat-card");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger within a group
      setTimeout(() => {
        entry.target.classList.add("visible");
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0) translateX(0)";
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

revealEls.forEach(el => {
  // Set initial hidden state if not already a .reveal
  if (!el.classList.contains("reveal")) {
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  }
  revealObserver.observe(el);
});

// ─── SKILL BARS ANIMATE ───────────────────────
const skillFills = document.querySelectorAll(".skill-fill");

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ─── SKILL CARD COLOR ─────────────────────────
document.querySelectorAll(".skill-card").forEach(card => {
  const color = card.dataset.color;
  if (color) {
    card.style.setProperty("--c", color);
    card.querySelector(".skill-fill").style.background = `linear-gradient(90deg, ${color}, #9b5de5)`;
  }
});

// ─── ACTIVE NAV LINK on SCROLL ───────────────
const sections  = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + entry.target.id) {
          link.classList.add("active");
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── SMOOTH SCROLL (fallback) ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ─── CONTACT FORM ─────────────────────────────
const form     = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");

form.addEventListener("submit", e => {
  e.preventDefault();

  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    formNote.style.color = "#ff6b9d";
    formNote.textContent = "⚠ Please fill in all required fields.";
    return;
  }

  // Simulate send
  const btn = form.querySelector(".btn-primary");
  btn.textContent = "Sending…";
  btn.style.opacity = "0.7";

  setTimeout(() => {
    formNote.style.color = "#38ef7d";
    formNote.textContent = "✓ Message sent! I'll get back to you soon.";
    btn.textContent = "Send Message ✦";
    btn.style.opacity = "1";
    form.reset();
    setTimeout(() => { formNote.textContent = ""; }, 5000);
  }, 1500);
});

// ─── FOOTER YEAR ──────────────────────────────
// Dynamically update year if needed
const footerYear = document.querySelector(".footer-copy");
if (footerYear) {
  footerYear.textContent = `© ${new Date().getFullYear()} Uzma Bibi. All rights reserved.`;
}

// ─── PAGE LOAD ANIMATION ──────────────────────
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";
  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });
});
