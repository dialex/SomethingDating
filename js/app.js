import { sections } from "./workflow.js";
import { setupInstallBanner } from "./install.js";

let view = "home";
let currentSectionId = null;
let currentStep = 0;
let ignoreHashChange = false;
let appVersion = "";

const $ = (id) => document.getElementById(id);
const elFooter      = () => document.querySelector("footer");
const elWizardNav   = () => $("wizard-nav");
const elBtnChevron  = () => $("btn-chevron");

function renderHome() {
  document.body.classList.add("home");
  document.body.classList.remove("wizard", "credits");
  elBtnChevron().style.display = "none";
  elFooter().style.display = "none";
  $("home-header").style.display = "";

  const main = $("main-content");
  main.classList.add("home-view");
  main.innerHTML = `
    <div class="section-grid">
      ${sections.map(s => `
        <div class="section-card" id="section-${s.id}">
          <div class="section-card-image" style="--c1:${s.color[0]};--c2:${s.color[1]}">
            ${s.cover ? `<img class="section-card-photo" src="${s.cover}" alt="" />` : ""}
            <div class="section-card-title">${s.title}</div>
          </div>
          <div class="section-card-footer">
            <span>${s.steps ? s.steps.length + " steps" : "Coming soon"}</span>
            <span class="section-card-cta">Start <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></span>
          </div>
        </div>
      `).join("")}
    </div>
    <p class="home-footer-msg">Take your time with each phase. Great relationships are built step by step.</p>
    <div class="home-meta">
      <a href="#credits" class="btn-credits">Credits</a>
      <div id="app-version">${appVersion ? "v" + appVersion : ""}</div>
    </div>`;

  sections.forEach(s => {
    $(`section-${s.id}`).addEventListener("click", () => enterSection(s.id));
  });

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
    main.innerHTML = `
      <div class="wip-card">
        <div class="wip-title">${section.title}</div>
        <p class="wip-sub">This section is still being written. Check back soon.</p>
      </div>`;
    return;
  }

  elWizardNav().style.display = "";

  const steps = section.steps;
  const total = steps.length;
  const stepIdx = Math.min(Math.max(currentStep, 0), total - 1);
  const step = steps[stepIdx];
  const isLast = stepIdx === total - 1;

  const gradient = `linear-gradient(90deg, ${section.color[0]}, ${section.color[1]})`;

  // Segmented progress
  const segments = steps.map((_, i) => {
    const cls = i < stepIdx ? "done" : i === stepIdx ? "current" : "";
    const style = (i <= stepIdx) ? `style="background:${gradient}"` : "";
    return `<div class="wizard-progress-seg ${cls}" ${style}></div>`;
  }).join("");

  // Extra block (optional)
  let extraHtml = "";
  if (step.extra) {
    const desc = step.extra.description;
    let body = "";
    if (Array.isArray(desc)) {
      body = `<ul class="wizard-extra-list">${desc.map(d => `<li>${d}</li>`).join("")}</ul>`;
    } else if (desc) {
      body = `<p class="wizard-extra-text">${desc}</p>`;
    }
    extraHtml = `
      <aside class="wizard-extra">
        <div class="wizard-extra-header">
          <div class="wizard-extra-icon" aria-hidden="true">
            <!-- lucide: lightbulb -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          </div>
          <h3 class="wizard-extra-title">${step.extra.title}</h3>
        </div>
        ${body}
      </aside>`;
  }

  main.innerHTML = `
    <section class="wizard">
      <div class="wizard-phase-header">
        <h1 class="wizard-phase-title">${section.title}</h1>
        <p class="wizard-phase-subtitle">${section.subtitle || ""}</p>
      </div>
      <div class="wizard-progress">${segments}</div>
      <div class="wizard-step-badge" style="background:${gradient}">Step ${stepIdx + 1} of ${total}</div>
      <article class="wizard-step-card">
        <h2 class="wizard-step-title">${step.title}</h2>
        ${step.description ? `<p class="wizard-step-description">${step.description}</p>` : ""}
        ${extraHtml}
      </article>
    </section>`;

  // Bottom nav state
  const btnPrev = $("btn-prev");
  btnPrev.style.visibility = stepIdx === 0 ? "hidden" : "visible";
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
  const next = currentStep + dir;
  if (next < 0) return;
  currentStep = next;
  applyState();
}

function goHome() {
  view = "home";
  currentSectionId = null;
  currentStep = 0;
  applyState();
}

$("btn-prev").addEventListener("click", () => navigate(-1));
$("btn-next").addEventListener("click", () => navigate(1));
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
