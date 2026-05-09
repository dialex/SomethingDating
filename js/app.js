import { sections } from "./workflow.js";
import { setupInstallBanner } from "./install.js";

let view = "home";
let currentSectionId = null;
let currentStep = 0;
let ignoreHashChange = false;

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
        <div class="section-card" id="section-${s.id}">
          <div class="section-card-image" style="--c1:${s.color[0]};--c2:${s.color[1]}">
            ${s.cover ? `<img class="section-card-photo" src="${s.cover}" alt="" />` : ""}
            <div class="section-card-title">${s.title}</div>
          </div>
          <div class="section-card-footer">
            <span>${s.steps ? s.steps.length + " steps" : "Coming soon"}</span>
            <span class="section-card-cta">Start →</span>
          </div>
        </div>
      `).join("")}
    </div>
    <p class="home-footer-msg">Take your time with each phase. Great relationships are built step by step.</p>
    <p class="home-credits-link"><a href="#credits">Credits</a></p>`;

  sections.forEach(s => {
    document.getElementById(`section-${s.id}`)
      .addEventListener("click", () => enterSection(s.id));
  });

  document.getElementById("main-content").classList.add("home-view");
  document.getElementById("home-header").style.display = "";
  document.getElementById("app-title").style.display = "none";
  document.body.classList.add("home");
  document.querySelector("footer").style.display = "none";
  document.getElementById("main-content").appendChild(document.getElementById("install-banner"));
}

function renderSection() {
  document.getElementById("main-content").classList.remove("home-view");
  document.getElementById("home-header").style.display = "none";
  document.getElementById("app-title").style.display = "";
  document.body.classList.remove("home");
  document.querySelector("footer").style.display = "";
  document.querySelector(".progress-wrap").before(document.getElementById("install-banner"));
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

function renderCredits() {
  elProgressWrap().style.display = "none";
  elNavButtons().style.display   = "none";
  elBtnReset().style.display     = "none";
  elBtnBack().style.display      = "";
  document.getElementById("main-content").classList.remove("home-view");
  document.getElementById("home-header").style.display = "none";
  document.getElementById("app-title").style.display = "";
  document.body.classList.remove("home");
  document.querySelector("footer").style.display = "";

  document.getElementById("main-content").innerHTML = `
    <div class="credits-card">
      <h2 class="credits-title">Credits</h2>
      <p class="credits-intro">Guide based on the work of Adam Something. App by Diogo Nunes.</p>

      <h3 class="credits-section">Photography</h3>
      <ul class="credits-list">
        <li>
          <strong>Intro</strong> — Photo by
          <a href="https://unsplash.com/@grakozy?utm_source=DatingGuide&utm_medium=referral" target="_blank" rel="noopener">Greg Rakozy</a>
          on
          <a href="https://unsplash.com/photos/silhouette-photography-of-person-oMpAz-DN-9I?utm_source=DatingGuide&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>.
        </li>
        <li>
          <strong>Meeting</strong> — Photo by
          <a href="https://unsplash.com/@silverkblack?utm_source=DatingGuide&utm_medium=referral" target="_blank" rel="noopener">Vitaly Gariev</a>
          on
          <a href="https://unsplash.com/photos/friends-enjoying-drinks-and-snacks-on-a-rooftop-eQlU4-7PGHw?utm_source=DatingGuide&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>.
        </li>
        <li>
          <strong>Dating</strong> — Photo by
          <a href="https://unsplash.com/@mikcudi?utm_source=DatingGuide&utm_medium=referral" target="_blank" rel="noopener">Miguel Andrade Guerrero</a>
          on
          <a href="https://unsplash.com/photos/grayscale-photo-of-couple-sitting-on-chair-eHto7efWCU8?utm_source=DatingGuide&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>.
        </li>
      </ul>
    </div>`;
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
  const section = sections.find(s => s.id === currentSectionId);
  if (currentStep >= section.steps.length) return `${currentSectionId}/done`;
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
      if (stepPart === "done") {
        currentStep = section.steps.length;
      } else {
        const n = parseInt(stepPart, 10);
        currentStep = isNaN(n) ? 0 : Math.max(0, n - 1);
      }
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
  const total = section.steps.length;
  if (dir === 1 && currentStep >= total) {
    goHome();
    return;
  }
  const next = currentStep + dir;
  if (next < 0) return;
  currentStep = next;
  applyState();
}

export function reset() {
  currentStep = 0;
  applyState();
}

function goHome() {
  view = "home";
  currentSectionId = null;
  currentStep = 0;
  applyState();
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

applyHash();
