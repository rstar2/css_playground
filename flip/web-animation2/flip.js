const optsDef = {
  duration: 300,
  easing: "ease-out"
};

// /**
//  * @param {HTMLElement}
//  * @param {Object} opts
//  */
// export default function flip(el, opts = {}) {
//   opts = { ...optsDef, ...opts };

//   // Get the first position.
//   const first = el.getBoundingClientRect();

//   // Move it to the end.
//   if (typeof opts.triggerAction === "string")
//     el.classList.add(opts.triggerAction);
//   else if (typeof opts.triggerAction === "function") opts.triggerAction();

//   // Get the last position.
//   const last = el.getBoundingClientRect();

//   // Invert.
//   const deltaX = first.left - last.left;
//   const deltaY = first.top - last.top;
//   const deltaW = first.width / last.width;
//   const deltaH = first.height / last.height;

//   // Go from the inverted position to last.
//   const player = el.animate(
//     [
//       {
//         transformOrigin: "top left",
//         transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`
//       },
//       {
//         transformOrigin: "top left",
//         transform: "none"
//       }
//     ],
//     {
//       duration: opts.duration,
//       easing: opts.easing
//     }
//   );

//   // Do any tidy up at the end
//   // of the animation.
//   if (opts.finishCallback)
//     player.addEventListener("finish", opts.finishCallback);
// }

/**
 * Animate layout change using the FLIP principle
 * @param {HTMLElement[]} elements - Elements to animate
 * @param {Function} triggerAction - Function which applies the layout change
 * @param {Function} [finishCallback] - Function which is called when the animation ends
 * @param {Object} [options] - Optional options. See `opts` for properties
 */
export default function flip(
  elements,
  triggerAction,
  finishCallback,
  options = {}
) {
  // normalize elements to array
  /**
   * @type {HTMLElement[]}
   */
  elements = elements.length !== undefined ? elements : [elements];

  // nothing to animate
  if (!elements.length) return;

  // merge options
  options = { ...optsDef, ...options };

  // get initial positions
  const startRecs = elements.map(el => el.getBoundingClientRect());

  // change layout
  triggerAction();

  // get end positions
  const endRecs = elements.map(el => el.getBoundingClientRect());

  // invert - move back to old positions
  const deltas = endRecs.map((endRec, index) => {
    const startRec = startRecs[index];
    return {
      x: startRec.left - endRec.left,
      y: startRec.top - endRec.top,
      scaleWidth: startRec.width / endRec.width,
      scaleHeight: startRec.height / endRec.height
    };
  });

  let finalAnimation;
  elements.forEach((el, index) => {
    const delta = deltas[index];
    
    // check if there's need for any animation
    if (delta.x === 0 && delta.y === 0 && delta.scaleWidth === 1 && delta.scaleHeight === 1)
       return;

    // Go from the inverted position to last.
    finalAnimation = el.animate(
      [
        {
          transformOrigin: "top left",
          transform: `translate(${delta.x}px, ${delta.y}px) scale(${delta.scaleWidth}, ${delta.scaleHeight})`
        },
        {
          transformOrigin: "top left",
          transform: "none"
        }
      ],
      {
        duration: options.duration,
        easing: options.easing
      }
    );
  });

  // Do any tidy up at the end
  // of the animation.
  if (finalAnimation && finishCallback)
    finalAnimation.addEventListener("finish", finishCallback);
}
