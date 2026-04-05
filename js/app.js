import { workflow } from "./workflow.js";
import { setupInstallBanner } from "./install.js";

let currentStep = 0;
const total = workflow.length;

export function render() {
  const main = document.getElementById("main-content");
  const isComplete = currentStep >= total;

  // Progress bar
  const displayStep = Math.min(currentStep + 1, total);
  const pct = Math.round((currentStep / total) * 100);
  document.getElementById("progress-text").textContent =
    isComplete ? `All ${total} steps done` : `Step ${displayStep} of ${total}`;
  document.getElementById("progress-pct").textContent = pct + "%";
  document.getElementById("progress-fill").style.width = pct + "%";

  // Navigation buttons
  document.getElementById("btn-prev").disabled = currentStep === 0;
  document.getElementById("btn-next").disabled = isComplete;
  document.getElementById("btn-next").textContent =
    currentStep === total - 1 ? "Finish" : "Next";
  document.getElementById("btn-reset").style.visibility =
    currentStep === 0 ? "hidden" : "visible";

  // Content
  if (isComplete) {
    main.innerHTML = `
      <div class="completion-card">
        <div class="completion-icon">✓</div>
        <div class="completion-title">You're ready!</div>
        <p class="completion-sub">You've worked through every step. Go get 'em — and remember, the best version of you is the honest one.</p>
      </div>`;
  } else {
    const step = workflow[currentStep];
    const items = step.instructions.map(i => `<li>${i}</li>`).join("");
    main.innerHTML = `
      <div class="step-card">
        <div class="step-header">
          <div class="step-badge">${currentStep + 1}</div>
          <h1 class="step-title">${step.title}</h1>
        </div>
        <ol class="instructions-list">${items}</ol>
      </div>`;
  }
}

export function navigate(dir) {
  const next = currentStep + dir;
  if (next < 0 || next > total) return;
  currentStep = next;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function reset() {
  currentStep = 0;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Wire up navigation
document.getElementById("btn-prev").addEventListener("click", () => navigate(-1));
document.getElementById("btn-next").addEventListener("click", () => navigate(1));
document.getElementById("btn-reset").addEventListener("click", reset);

// Install banner
setupInstallBanner();

// Service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

render();
