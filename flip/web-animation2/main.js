import flip from "./flip.js";

const container = document.querySelector(".container");

document
  .querySelectorAll(".maximizable")
  .forEach(maxi =>
    maxi.addEventListener("click", doAnimation.bind(this, maxi))
  );


/**
 * @type {HTMLElement}
 */
let expandedMaxi, oldParent, oldSibling;

/**
 *
 * @param {HTMLElement} maxi
 */
function doAnimation(maxi) {
  // get all the elements that we want to animate , e.g. those that we expect to be changed after
  // the layout change. These will be:
  // 1. All columns
  // 2. All children of column in which is the 'maxi' element - (e.g. it's sibling and it itself)
  let elements = Array.from(document.querySelectorAll('.column'));

  // if about to expand - remember its current parent
  if (!expandedMaxi) {
    oldParent = maxi.parentElement;
    oldSibling = maxi.nextElementSibling;
    expandedMaxi = maxi;
  } else {
      // TODO: 
      if (expandedMaxi !== maxi) {
        throw new Error('Not implemented yet');
      }

      elements.push(expandedMaxi);
      expandedMaxi = null;
  }

  
  elements = elements.concat(Array.from(oldParent.children));

  // Do animation
  flip(
    elements, // elements to animate layout change of

    function triggerAction() {
      // called when we should do layout change

      // if to be expanded - append the 'maxi' element to the container
      // else return it bake to it's old position
      if (expandedMaxi) {
        container.insertBefore(expandedMaxi, container.firstChild);
        expandedMaxi.classList.add("maximized");
      } else {
        oldParent.insertBefore(maxi, oldSibling);
        maxi.classList.remove("maximized");
      }
      
    },

    function onDone() {
      // called after the animation is done
      console.log("Done");
    }
  );
}
