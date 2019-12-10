const optsDef = {
  duration: 300,
  easing: "ease-out"
};

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

     // calculating from middle of object
      // this works with flexbox (calculating from corner does not)
    // return {
    //     x: startRec.left + startRec.width / 2 - (endRec.left + endRec.width / 2),
    //     y: startRec.top + startRec.height / 2 - (endRec.top + endRec.height / 2),
    //     scaleWidth: startRec.width / endRec.width,
    //     scaleHeight: startRec.height / endRec.height
    //   };
  });

  let finalAnimation;
  elements.forEach((el, index) => {
    const delta = deltas[index];
    
    // check if there's need for any animation
    if (delta.x === 0 && delta.y === 0 && delta.scaleWidth === 1 && delta.scaleHeight === 1)
       return;

    //    el.style.transformOrigin = "top left";
    //    el.style.transform = "translate(" +
    //    delta.x.toFixed(2) + "px," +
    //    delta.y.toFixed(2) + "px) " +
    //    "scale(" +
    //    delta.scaleWidth.toFixed(2) + "," +
    //    delta.scaleHeight.toFixed(2) + ")";   

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
