function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function populateModalSteps() {
  const steps = isIos()
    ? [
        { icon: "⬆️", text: "Tap the <strong>Share</strong> button at the bottom of Safari" },
        { icon: "➕", text: "Scroll down and tap <strong>Add to Home Screen</strong>" },
        { icon: "✓",  text: "Tap <strong>Add</strong> in the top-right corner" },
      ]
    : [
        { icon: "⋮",  text: "Tap the <strong>menu</strong> (three dots) in Chrome's top-right corner" },
        { icon: "➕", text: "Tap <strong>Add to Home Screen</strong>" },
        { icon: "✓",  text: "Tap <strong>Add</strong> to confirm" },
      ];

  document.getElementById("modal-steps").innerHTML = steps
    .map(s => `<div class="modal-step"><div class="modal-step-icon">${s.icon}</div><div>${s.text}</div></div>`)
    .join("");
}

export function setupInstallBanner() {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || navigator.standalone === true;

  if (isStandalone) return;

  const banner   = document.getElementById("install-banner");
  const dismiss  = document.getElementById("btn-dismiss-banner");
  const modal    = document.getElementById("install-modal");
  const modalClose = document.getElementById("btn-modal-close");

  let deferredPrompt = null;

  banner.style.display = "flex";

  function dismissBanner() {
    banner.style.display = "none";
  }

  function openModal() {
    populateModalSteps();
    modal.classList.remove("hidden");
  }

  function closeModal(e) {
    if (!e || e.target === modal) {
      modal.classList.add("hidden");
    }
  }

  banner.addEventListener("click", (e) => {
    if (dismiss.contains(e.target)) return;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        dismissBanner();
      });
    } else {
      openModal();
    }
  });

  dismiss.addEventListener("click", (e) => {
    e.stopPropagation();
    dismissBanner();
  });

  modal.addEventListener("click", closeModal);
  modalClose.addEventListener("click", () => modal.classList.add("hidden"));

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener("appinstalled", dismissBanner);
}
