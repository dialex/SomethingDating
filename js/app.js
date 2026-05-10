import { sections } from "./workflow.js";
import { setupInstallBanner } from "./install.js";
import { fitText } from "./fittext.js";

let view = "home";
let currentSectionId = null;
let currentStep = 0;
let ignoreHashChange = false;
let appVersion = "";

const $ = (id) => document.getElementById(id);
const elFooter      = () => document.querySelector("footer");
const elWizardNav   = () => $("wizard-nav");
const elBtnChevron  = () => $("btn-chevron");

function tpl(id) {
  return $(id).content.cloneNode(true);
}

function renderHome() {
  document.body.classList.add("home");
  document.body.classList.remove("wizard", "credits");
  elBtnChevron().style.display = "none";
  elFooter().style.display = "none";
  $("home-header").style.display = "";

  const main = $("main-content");
  main.classList.add("home-view");

  const home = tpl("tpl-home");
  const grid = home.querySelector('[data-slot="grid"]');
  home.querySelector('[data-slot="version"]').textContent = appVersion ? "v" + appVersion : "";

  sections.forEach(s => {
    const node = tpl("tpl-section-card");
    const card = node.querySelector('[data-slot="card"]');
    card.id = `section-${s.id}`;
    const image = node.querySelector('[data-slot="image"]');
    image.style.setProperty("--c1", s.color[0]);
    image.style.setProperty("--c2", s.color[1]);
    const photo = node.querySelector('[data-slot="photo"]');
    if (s.cover) {
      photo.src = s.cover;
      photo.hidden = false;
    }
    node.querySelector('[data-slot="title"]').textContent = s.title;
    node.querySelector('[data-slot="steps"]').textContent =
      s.steps ? `${s.steps.length} steps` : "Coming soon";
    card.addEventListener("click", () => enterSection(s.id));
    grid.appendChild(node);
  });

  main.replaceChildren(home);
  main.appendChild($("install-banner"));
}

function renderSection() {
  document.body.classList.remove("home", "credits");
  document.body.classList.add("wizard");
  $("home-header").style.display = "none";
  elBtnChevron().style.display = "none";
  elFooter().style.display = "";

  const section = sections.find(s => s.id === currentSectionId);
  const main = $("main-content");
  main.classList.remove("home-view");

  if (!section.steps) {
    elWizardNav().style.display = "none";
    const wip = tpl("tpl-wip");
    wip.querySelector('[data-slot="title"]').textContent = section.title;
    main.replaceChildren(wip);
    return;
  }

  elWizardNav().style.display = "";

  const steps = section.steps;
  const total = steps.length;
  const stepIdx = Math.min(Math.max(currentStep, 0), total - 1);
  const step = steps[stepIdx];
  const isLast = stepIdx === total - 1;
  const gradient = `linear-gradient(90deg, ${section.color[0]}, ${section.color[1]})`;

  const node = tpl("tpl-wizard-step");
  node.querySelector('[data-slot="phase-title"]').textContent = section.title;
  node.querySelector('[data-slot="phase-subtitle"]').textContent = section.subtitle || "";

  // Segmented progress
  const progress = node.querySelector('[data-slot="progress"]');
  steps.forEach((_, i) => {
    const seg = document.createElement("div");
    seg.className = "wizard-progress-seg" + (i < stepIdx ? " done" : i === stepIdx ? " current" : "");
    if (i <= stepIdx) seg.style.background = gradient;
    progress.appendChild(seg);
  });

  // Step badge
  const badge = node.querySelector('[data-slot="step-badge"]');
  badge.style.background = gradient;
  badge.textContent = `Step ${stepIdx + 1} of ${total}`;

  // Step title + description
  node.querySelector('[data-slot="step-title"]').textContent = step.title;
  const desc = node.querySelector('[data-slot="step-description"]');
  if (step.description) {
    desc.textContent = step.description;
    desc.hidden = false;
  }

  // Extra block (optional)
  const extraSlot = node.querySelector('[data-slot="extra"]');
  if (step.extra) {
    const extra = tpl("tpl-wizard-extra");
    extra.querySelector('[data-slot="title"]').textContent = step.extra.title;
    const body = extra.querySelector('[data-slot="body"]');
    const extraDesc = step.extra.description;
    if (Array.isArray(extraDesc)) {
      const ul = document.createElement("ul");
      ul.className = "wizard-extra-list";
      extraDesc.forEach(d => {
        const li = document.createElement("li");
        li.textContent = d;
        ul.appendChild(li);
      });
      body.appendChild(ul);
    } else if (extraDesc) {
      const p = document.createElement("p");
      p.className = "wizard-extra-text";
      p.textContent = extraDesc;
      body.appendChild(p);
    }
    extraSlot.replaceWith(extra);
  } else {
    extraSlot.remove();
  }

  main.replaceChildren(node);

  // Wire swipe gestures on the rendered card
  const card = main.querySelector(".wizard-step-card");
  if (card) {
    attachSwipe(card);

    // Slide the new card in from the opposite side of the previous swipe.
    if (pendingEnterDir !== null) {
      const dir = pendingEnterDir;
      pendingEnterDir = null;
      // New card slides in from the opposite side: next from the left, back from the right.
      const startOffset = dir > 0 ? -window.innerWidth : window.innerWidth;
      card.classList.add("is-entering");
      card.style.transform = `translateX(${startOffset}px)`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.remove("is-entering");
          card.style.transform = "";
        });
      });
    }
  }

  // Bottom nav state
  $("btn-next-icon-heart").style.display = isLast ? "none" : "";
  $("btn-next-icon-check").style.display = isLast ? "" : "none";
}

async function renderCredits() {
  document.body.classList.remove("home", "wizard");
  document.body.classList.add("credits");
  $("home-header").style.display = "none";
  elBtnChevron().style.display = "";
  elFooter().style.display = "none";

  const main = $("main-content");
  main.classList.remove("home-view");

  const html = await fetch("html/credits.html").then(r => r.text());
  main.innerHTML = html;
}

function render() {
  if (view === "home") {
    renderHome();
  } else if (view === "credits") {
    renderCredits();
  } else {
    renderSection();
  }
}

// --- Hash routing ---

function hashForState() {
  if (view === "home") return "";
  if (view === "credits") return "credits";
  return `${currentSectionId}/${currentStep + 1}`;
}

function applyState() {
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
  const h = hashForState();
  ignoreHashChange = true;
  location.hash = h;
}

function applyHash() {
  const hash = location.hash.slice(1);
  if (!hash) {
    view = "home";
    currentSectionId = null;
    currentStep = 0;
  } else if (hash === "credits") {
    view = "credits";
    currentSectionId = null;
    currentStep = 0;
  } else {
    const [sectionId, stepPart] = hash.split("/");
    const section = sections.find(s => s.id === sectionId);
    if (!section) {
      view = "home";
      currentSectionId = null;
      currentStep = 0;
    } else {
      view = "section";
      currentSectionId = sectionId;
      const n = parseInt(stepPart, 10);
      const max = section.steps ? section.steps.length - 1 : 0;
      currentStep = isNaN(n) ? 0 : Math.max(0, Math.min(n - 1, max));
    }
  }
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("hashchange", () => {
  if (ignoreHashChange) {
    ignoreHashChange = false;
    return;
  }
  applyHash();
});

// --- Navigation ---

function enterSection(id) {
  view = "section";
  currentSectionId = id;
  currentStep = 0;
  applyState();
}

export function navigate(dir) {
  const section = sections.find(s => s.id === currentSectionId);
  if (!section || !section.steps) return;
  const total = section.steps.length;
  if (dir === 1 && currentStep >= total - 1) {
    goHome();
    return;
  }
  if (dir === -1 && currentStep === 0) {
    goHome();
    return;
  }
  currentStep += dir;
  applyState();
}

function goHome() {
  view = "home";
  currentSectionId = null;
  currentStep = 0;
  applyState();
}

// --- Swipe + animated transition ---
const SWIPE_THRESHOLD = 70;
const SWIPE_DURATION = 400;
let pendingEnterDir = null; // direction the new card should slide IN from

function animateOutThenNavigate(card, dir) {
  if (!card || card.dataset.leaving) {
    navigate(dir);
    return;
  }
  card.dataset.leaving = "1";
  // dir > 0 (next) — card exits to the right; dir < 0 (back) — card exits to the left.
  const offset = dir > 0 ? window.innerWidth : -window.innerWidth;
  card.style.transform = `translateX(${offset}px)`;
  card.style.opacity = "0";
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    pendingEnterDir = dir;
    navigate(dir);
  };
  card.addEventListener("transitionend", finish, { once: true });
  setTimeout(finish, SWIPE_DURATION + 50);
}

function navigateAnimated(dir) {
  const card = document.querySelector(".wizard-step-card");
  if (!card) {
    navigate(dir);
    return;
  }
  animateOutThenNavigate(card, dir);
}

function clearActiveButtons() {
  $("btn-prev").classList.remove("is-active");
  $("btn-next").classList.remove("is-active");
}

function highlightForDelta(dx) {
  // Swipe right (dx > 0) = next; swipe left (dx < 0) = back.
  clearActiveButtons();
  if (dx > 0) $("btn-next").classList.add("is-active");
  else if (dx < 0) $("btn-prev").classList.add("is-active");
}

function attachSwipe(card) {
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dragging = false;
  let axisLocked = null; // "x" once we commit to horizontal

  card.addEventListener("pointerdown", (e) => {
    if (card.dataset.leaving) return;
    startX = e.clientX;
    startY = e.clientY;
    dx = 0;
    dragging = true;
    axisLocked = null;
  });

  card.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const ax = e.clientX - startX;
    const ay = e.clientY - startY;
    if (axisLocked === null) {
      if (Math.abs(ax) < 6 && Math.abs(ay) < 6) return;
      axisLocked = Math.abs(ax) > Math.abs(ay) ? "x" : "y";
      if (axisLocked === "x") {
        card.classList.add("is-swiping");
        card.setPointerCapture(e.pointerId);
      } else {
        dragging = false;
        return;
      }
    }
    dx = ax;
    card.style.transform = `translateX(${dx}px)`;
    highlightForDelta(dx);
  });

  const release = () => {
    if (!dragging && !card.classList.contains("is-swiping")) return;
    dragging = false;
    card.classList.remove("is-swiping");
    clearActiveButtons();
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const dir = dx > 0 ? 1 : -1;
      animateOutThenNavigate(card, dir);
    } else {
      card.style.transform = "";
    }
    dx = 0;
  };

  card.addEventListener("pointerup", release);
  card.addEventListener("pointercancel", release);
}

$("btn-prev").addEventListener("click", () => navigateAnimated(-1));
$("btn-next").addEventListener("click", () => navigateAnimated(1));
$("btn-restart").addEventListener("click", goHome);
$("btn-chevron").addEventListener("click", goHome);

setupInstallBanner();

fetch("manifest.json")
  .then(r => r.json())
  .then(m => {
    if (m.version) {
      appVersion = m.version;
      const el = $("app-version");
      if (el) el.textContent = "v" + appVersion;
    }
  })
  .catch(() => {});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

applyHash();

// Fit the home title to its container so it never overflows on narrow viewports.
// Wait for fonts to load first — measuring with the fallback font gives wrong widths.
function fitTitles() {
  const titleLine = document.querySelector(".title-line-top");
  const titleWord = document.querySelector(".title-word-dating");
  if (titleLine) fitText(titleLine, { maxFontSize: 137 });
  if (titleWord) fitText(titleWord, { maxFontSize: 280 });
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitTitles);
} else {
  fitTitles();
}
