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

  // Get the last position.
  const last = el.getBoundingClientRect();

  // Invert.
  const deltaX = first.left - last.left;
  const deltaY = first.top - last.top;
  const deltaW = first.width / last.width;
  const deltaH = first.height / last.height;

  // Go from the inverted position to last.
  const player = el.animate(
    [
      {
        // transformOrigin: "top left",
        transformOrigin: "top center",
        transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`
      },
      {
        transformOrigin: "top left",
        transform: "none"
      }
    ],
    {
      duration: opts.duration,
      easing: opts.easing
    }
  );

  // Do any tidy up at the end
  // of the animation.
  if (opts.finishCallback)
    player.addEventListener("finish", opts.finishCallback);
}
