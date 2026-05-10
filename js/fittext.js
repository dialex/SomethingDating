// Sizes an element's font so it fits inside its parent container.
// Measures scrollWidth vs container width and shrinks until it fits.
export function fitText(el, { minFontSize = 10, maxFontSize = 400, step = 1 } = {}) {
  const fit = () => {
    const container = el.parentElement;
    if (!container || !container.clientWidth) return;
    const containerWidth = container.clientWidth;

    // Start at max and shrink until the text fits.
    let size = maxFontSize;
    el.style.fontSize = size + "px";
    while (el.scrollWidth > containerWidth && size > minFontSize) {
      size -= step;
      el.style.fontSize = size + "px";
    }
  };

  fit();

  let last = 0;
  window.addEventListener("resize", () => {
    const now = Date.now();
    if (now - last < 50) return;
    last = now;
    fit();
  });
}
