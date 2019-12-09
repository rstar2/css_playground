import flip from './flip.js';

const container = document.querySelector(".container");

document
  .querySelectorAll("maximizable")
  .forEach(maxi =>
    maxi.addEventListener("click", doAnimation.bind(this, maxi))
  );

let expanded = false;

/**
 *
 * @param {HTMLElement} maxi
 */
function doAnimation(maxi) {
  // Do animation
  flip(
    elms, // elements to animate layout change of

    function triggerAction() {
      // called when we should do layout change
      expanded = !expanded;
      if (expanded) {
        page.insertBefore(maxi, page.firstChild);
      } else {
        parent.insertBefore(maxi, parent.firstChild);
      }
      maxi.classList.toggle("maximized", expanded);
    },

    function onDone() {
      // called after the animation is done
      console.log("Done");
    }
  );
}
