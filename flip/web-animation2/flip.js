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
        transformOrigin: "top left",
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


/**
 * Animate layout change using the FLIP principle
 * @param {Array|Element} elements - Elements to animate
 * @param {Function} doChange - Function which applies the layout change
 * @param {Function} callback - Function which is called when the animation ends
 * @param {Object} options - Optional options. See `opts` for properties
 */
function FLIP(elements, doChange, callback, options) {
    // merge options
    var opts = {
      time: 0.4, // time it takes to animate
      animatingClass: "flip-animating", // class to apply to elements being animated
      scalingClass: "flip-scaling" // class to apply to elements being scaled
    };
    for (var k in options) {
      opts[k] = options[k];
    }
  
    // normalize elements to array
    elements = elements.length !== undefined ? elements : [elements];
  
    // get initial positions
    var pres = [];
    for (var i = 0, j = elements.length; i < j; ++i) {
      pres[i] = elements[i].getBoundingClientRect();
    }
  
    // change layout
    doChange();
  
    // move back to old positions
    for (i = 0; i < j; ++i) {
      var elm = elements[i],
        pre = pres[i],
        post = elm.getBoundingClientRect();
  
      // calculating from middle of object
      // this works with flexbox (calculating from corner does not)
      var delta = {
        left: pre.left + pre.width / 2 - (post.left + post.width / 2),
        top: pre.top + pre.height / 2 - (post.top + post.height / 2),
        scaleWidth: pre.width / post.width,
        scaleHeight: pre.height / post.height
      };
  
      elm.style.transform =
        "translate(" +
        delta.left.toFixed(2) +
        "px," +
        delta.top.toFixed(2) +
        "px) " +
        "scale(" +
        delta.scaleWidth.toFixed(2) +
        "," +
        delta.scaleHeight.toFixed(2) +
        ")";
  
      elm.classList.add(opts.animatingClass);
      if (
        Math.round(delta.scaleWidth * 100) !== 100 ||
        Math.round(delta.scaleHeight * 100) !== 100
      ) {
        elm.classList.add(opts.scalingClass);
      }
    }
  
    // wait for styles to apply, then animate to new position
    requestAnimationFrame(function() {
      for (i = 0; i < j; ++i) {
        elements[i].style.transition = "transform " + opts.time + "s";
        elements[i].style.transform = "";
      }
  
      // proper way would be listening for `transitionend` event
      // but fuck that, amirite
      setTimeout(function() {
        for (i = 0; i < j; ++i) {
          elements[i].style.transition = "";
          elements[i].classList.remove(opts.animatingClass, opts.scalingClass);
        }
        callback();
      }, opts.time * 1000);
    });
  }