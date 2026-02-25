/* =============================================
   LUMIÈRE — Image Gallery
   script.js
   ============================================= */

// ─── DATA ─────────────────────────────────────
const IMAGES = [
  {
    id: 1, title: "Morning Mist", cat: "nature", wide: true,
    desc: "Soft fog rolling over mountain valleys at the break of dawn.",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80"
  },
  {
    id: 2, title: "Steel & Glass", cat: "urban",
    desc: "Modern architecture reflecting a cityscape through geometric facades.",
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80"
  },
  {
    id: 3, title: "Golden Hour", cat: "nature",
    desc: "The last warm light of afternoon bathing an open field in amber.",
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=700&q=80"
  },
  {
    id: 4, title: "Reverie", cat: "portrait",
    desc: "A quiet moment of introspection captured in soft window light.",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=80"
  },
  {
    id: 5, title: "Fractured Light", cat: "abstract", wide: true,
    desc: "Prism refractions cast across geometric glass and shadow.",
    src: "https://images.unsplash.com/photo-1550537687-c91072c4792d?w=900&q=80"
  },
  {
    id: 6, title: "Santorini Blue", cat: "travel",
    desc: "Iconic whitewashed domes above the shimmering Aegean Sea.",
    src: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80"
  },
  {
    id: 7, title: "Neon Rain", cat: "urban",
    desc: "Rain-slicked cobblestones mirroring city lights at midnight.",
    src: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=700&q=80"
  },
  {
    id: 8, title: "Forest Canopy", cat: "nature",
    desc: "Looking skyward through ancient trees toward scattered light.",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=80"
  },
  {
    id: 9, title: "Desert Solitude", cat: "travel", wide: true,
    desc: "Endless dunes stretching to a pale and quiet horizon.",
    src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80"
  },
  {
    id: 10, title: "Chroma", cat: "abstract",
    desc: "Bold colour fields bleeding and converging across the canvas.",
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=700&q=80"
  },
  {
    id: 11, title: "Gaze", cat: "portrait",
    desc: "Eyes that carry a thousand quiet, unspoken words.",
    src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=700&q=80"
  },
  {
    id: 12, title: "Subway Stories", cat: "urban",
    desc: "Strangers sharing the underground at the edge of midnight.",
    src: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=700&q=80"
  },
  {
    id: 13, title: "Ocean Geometry", cat: "abstract",
    desc: "Aerial patterns formed by waves meeting the shoreline.",
    src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=700&q=80"
  },
  {
    id: 14, title: "Kyoto Temple", cat: "travel", wide: true,
    desc: "An ancient wooden gate standing through the turn of centuries.",
    src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80"
  },
  {
    id: 15, title: "Wild Spirit", cat: "nature",
    desc: "A lone wolf surveying the vast reach of its mountain domain.",
    src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=700&q=80"
  },
  {
    id: 16, title: "Contemplation", cat: "portrait",
    desc: "Solitude found in the middle of a restless, bustling city.",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80"
  },
  {
    id: 17, title: "Signal", cat: "abstract",
    desc: "Light trails tracing invisible arcs through the dark.",
    src: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=700&q=80"
  },
  {
    id: 18, title: "Coastal Path", cat: "travel",
    desc: "A winding cliff trail above the churning sea at dusk.",
    src: "https://images.unsplash.com/photo-1502126324834-38f8e02d7160?w=700&q=80"
  }
];

// ─── STATE ────────────────────────────────────
let currentFilter = "all";
let visibleImages  = [];
let currentIndex   = 0;

// ─── ELEMENT REFS ─────────────────────────────
const galleryEl   = document.getElementById("gallery");
const lightboxEl  = document.getElementById("lightbox");
const lbImg       = document.getElementById("lb-img");
const lbTitle     = document.getElementById("lb-title");
const lbTag       = document.getElementById("lb-tag");
const lbDesc      = document.getElementById("lb-desc");
const lbCounter   = document.getElementById("lb-counter");
const imageCount  = document.getElementById("image-count");

// ─── BUILD GALLERY ────────────────────────────
function buildGallery() {
  galleryEl.innerHTML = "";

  IMAGES.forEach((img, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item" + (img.wide ? " wide" : "");
    item.dataset.id  = img.id;
    item.dataset.cat = img.cat;
    item.style.animationDelay = `${index * 0.045}s`;

    item.innerHTML = `
      <img class="thumb" src="${img.src}" alt="${img.title}" loading="lazy" />
      <div class="item-overlay">
        <div class="item-title">${img.title}</div>
        <div class="item-cat">${img.cat}</div>
      </div>
    `;

    item.addEventListener("click", () => openLightbox(img.id));
    galleryEl.appendChild(item);
  });
}

// ─── FILTER ───────────────────────────────────
function applyFilter(filter) {
  currentFilter = filter;
  const items = galleryEl.querySelectorAll(".gallery-item");

  let visible = 0;
  items.forEach(item => {
    const match = filter === "all" || item.dataset.cat === filter;
    item.classList.toggle("hidden", !match);
    if (match) visible++;
  });

  imageCount.textContent = `${visible} Photograph${visible !== 1 ? "s" : ""}`;
  visibleImages = filter === "all" ? IMAGES : IMAGES.filter(i => i.cat === filter);
}

// ─── FILTER BUTTONS ───────────────────────────
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);
  });
});

// ─── LIGHTBOX OPEN ────────────────────────────
function openLightbox(id) {
  visibleImages = currentFilter === "all" ? IMAGES : IMAGES.filter(i => i.cat === currentFilter);
  currentIndex  = visibleImages.findIndex(i => i.id === id);
  updateLightboxContent();
  lightboxEl.classList.add("open");
  document.body.style.overflow = "hidden";
}

// ─── LIGHTBOX CONTENT ─────────────────────────
function updateLightboxContent() {
  const img = visibleImages[currentIndex];
  // Reset scale so transition replays
  lbImg.style.transition = "none";
  lbImg.src = img.src;
  lbImg.alt = img.title;
  requestAnimationFrame(() => {
    lbImg.style.transition = "";
  });
  lbTitle.textContent   = img.title;
  lbTag.textContent     = img.cat;
  lbDesc.textContent    = img.desc;
  lbCounter.textContent = `${currentIndex + 1} / ${visibleImages.length}`;
}

// ─── LIGHTBOX CLOSE ───────────────────────────
function closeLightbox() {
  lightboxEl.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.getElementById("lb-backdrop").addEventListener("click", closeLightbox);

// ─── NAV BUTTONS ──────────────────────────────
document.getElementById("lb-prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  updateLightboxContent();
});

document.getElementById("lb-next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % visibleImages.length;
  updateLightboxContent();
});

// ─── KEYBOARD NAVIGATION ──────────────────────
document.addEventListener("keydown", e => {
  if (!lightboxEl.classList.contains("open")) return;

  switch (e.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowLeft":
      currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
      updateLightboxContent();
      break;
    case "ArrowRight":
      currentIndex = (currentIndex + 1) % visibleImages.length;
      updateLightboxContent();
      break;
  }
});

// ─── TOUCH SWIPE SUPPORT ──────────────────────
let touchStartX = 0;

lightboxEl.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightboxEl.addEventListener("touchend", e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) < 40) return; // ignore small swipes
  if (diff > 0) {
    // swipe left → next
    currentIndex = (currentIndex + 1) % visibleImages.length;
  } else {
    // swipe right → prev
    currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  }
  updateLightboxContent();
}, { passive: true });

// ─── INIT ─────────────────────────────────────
buildGallery();
applyFilter("all");
