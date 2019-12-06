const optsDef = {
  duration: 300,
  easing: "ease-out"
};

/**
 * @param {HTMLElement}
 * @param {Object} opts
 */
export default function flip(el, opts = {}) {
  opts = { ...optsDef, ...opts };

  // Get the first position.
  const first = el.getBoundingClientRect();

  // Move it to the end.
  if (typeof opts.triggerAction === "string")
    el.classList.add(opts.triggerAction);
  else if (typeof opts.triggerAction === "function") opts.triggerAction();

  // Read again. This forces a sync
  // layout, so be careful.
  const last = el.getBoundingClientRect();

  // Invert - get changes
  const deltaX = first.left - last.left;
  const deltaY = first.top - last.top;
  const deltaW = first.width / last.width;
  const deltaH = first.height / last.height;

  // Invert - make it. Just be
  // sure to stick to compositor-only
  // props like transform and opacity
  // where possible.
  el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;

  // Wait for the next frame so we
  // know all the style changes have
  // taken hold.
  requestAnimationFrame(function() {
    // Switch on animations.
    el.classList.add("animate-on-transforms");

    // GO GO GOOOOOO!
    el.style.transform = "";
  });

  // Do any tidy up at the end
  // of the animation - Capture the end with transitionend
  if (opts.finishCallback) 
    el.addEventListener("transitionend", opts.finishCallback);
}
