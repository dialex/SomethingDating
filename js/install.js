function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

const ICON = {
  // lucide: share
  share: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>`,
  // lucide: plus
  plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  // lucide: check
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  // lucide: ellipsis-vertical
  more: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
};

function populateModalSteps() {
  const steps = isIos()
    ? [
        { icon: ICON.share, text: "Tap the <strong>Share</strong> button at the bottom of Safari" },
        { icon: ICON.plus,  text: "Scroll down and tap <strong>Add to Home Screen</strong>" },
        { icon: ICON.check, text: "Tap <strong>Add</strong> in the top-right corner" },
      ]
    : [
        { icon: ICON.more,  text: "Tap the <strong>menu</strong> (three dots) in Chrome's top-right corner" },
        { icon: ICON.plus,  text: "Tap <strong>Add to Home Screen</strong>" },
        { icon: ICON.check, text: "Tap <strong>Add</strong> to confirm" },
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
