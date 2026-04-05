import { sections } from "./workflow.js";
import { setupInstallBanner } from "./install.js";

let view = "home";
let currentSectionId = null;
let currentStep = 0;

const elProgressWrap = () => document.querySelector(".progress-wrap");
const elNavButtons   = () => document.querySelector(".nav-buttons");
const elBtnReset     = () => document.getElementById("btn-reset");
const elBtnBack      = () => document.getElementById("btn-back");

function renderHome() {
  elProgressWrap().style.display = "none";
  elNavButtons().style.display   = "none";
  elBtnReset().style.display     = "none";
  elBtnBack().style.display      = "none";

  const main = document.getElementById("main-content");
  main.innerHTML = `
    <div class="section-grid">
      ${sections.map(s => `
        <button class="section-btn" id="section-${s.id}">
          ${s.title}
        </button>
      `).join("")}
    </div>`;

  sections.forEach(s => {
    document.getElementById(`section-${s.id}`)
      .addEventListener("click", () => enterSection(s.id));
  });
}

function renderSection() {
  const section = sections.find(s => s.id === currentSectionId);
  elBtnBack().style.display = "";

  if (!section.steps) {
    elProgressWrap().style.display = "none";
    elNavButtons().style.display   = "none";
    elBtnReset().style.display     = "none";
    document.getElementById("main-content").innerHTML = `
      <div class="wip-card">
        <div class="wip-title">${section.title}</div>
        <p class="wip-sub">This section is still being written. Check back soon.</p>
      </div>`;
    return;
  }

  const steps = section.steps;
  const total = steps.length;
  const isComplete = currentStep >= total;

  elProgressWrap().style.display = "";
  elNavButtons().style.display   = "";
  elBtnReset().style.display     = "";

  const displayStep = Math.min(currentStep + 1, total);
  const pct = isComplete ? 100 : Math.round((currentStep / total) * 100);
  document.getElementById("progress-text").textContent =
    isComplete ? `All ${total} steps done` : `Step ${displayStep} of ${total}`;
  document.getElementById("progress-pct").textContent = pct + "%";
  document.getElementById("progress-fill").style.width = pct + "%";

  document.getElementById("btn-prev").disabled = isComplete || currentStep === 0;
  document.getElementById("btn-next").disabled = false;
  document.getElementById("btn-next").textContent =
    currentStep === total - 1 ? "Finish" : isComplete ? "Next phase" : "Next";
  elBtnReset().style.visibility = currentStep === 0 ? "hidden" : "visible";

  if (isComplete) {
    const sectionIndex = sections.findIndex(s => s.id === currentSectionId);
    const nextSection = sections[sectionIndex + 1];
    document.getElementById("main-content").innerHTML = `
      <div class="completion-card">
        <div class="completion-icon">✓</div>
        <div class="completion-title">${section.title} done</div>
        <p class="completion-sub">${
          nextSection
            ? `You're ready for the next phase: <strong>${nextSection.title}</strong>.`
            : `You've completed the full guide. Go get 'em.`
        }</p>
      </div>`;
    return;
  }

  const step = steps[currentStep];
  const items = step.instructions.map(i => `<li>${i}</li>`).join("");
  document.getElementById("main-content").innerHTML = `
    <div class="step-card">
      <div class="step-header">
        <div class="step-badge">${currentStep + 1}</div>
        <h1 class="step-title">${step.title}</h1>
      </div>
      <ol class="instructions-list">${items}</ol>
    </div>`;
}

function render() {
  if (view === "home") {
    renderHome();
  } else {
    renderSection();
  }
}

function enterSection(id) {
  view = "section";
  currentSectionId = id;
  currentStep = 0;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function navigate(dir) {
  const section = sections.find(s => s.id === currentSectionId);
  const total = section.steps.length;
  if (dir === 1 && currentStep >= total) {
    goHome();
    return;
  }
  const next = currentStep + dir;
  if (next < 0) return;
  currentStep = next;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function reset() {
  currentStep = 0;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goHome() {
  view = "home";
  currentSectionId = null;
  currentStep = 0;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("btn-prev").addEventListener("click", () => navigate(-1));
document.getElementById("btn-next").addEventListener("click", () => navigate(1));
document.getElementById("btn-reset").addEventListener("click", reset);
document.getElementById("btn-back").addEventListener("click", goHome);

setupInstallBanner();

fetch("manifest.json")
  .then(r => r.json())
  .then(m => {
    if (m.version) document.getElementById("app-version").textContent = "v" + m.version;
  })
  .catch(() => {});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

render();
