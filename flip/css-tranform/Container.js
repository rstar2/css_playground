import flip from "./flip.js";
import { addClass, removeClass } from "./utils.js";

export default class Container {
  /**
   * @type {HTMLElement}
   */
  _container;

  /**
   * @type {Number}
   */
  _count = 0;

  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this._container = container;

    const items = container.querySelectorAll(".item");
    items.forEach(item => this._addRemoveListener(item));
  }

  appendItem() {
    const startPositions = this._getStartPositions();

    if (!startPositions.length) {
      // TODO:
      return;
    }

    const lastItemPos = startPositions[startPositions.length - 1];

    // create a new item (not yet inserted)
    const item = this._createItem();

    // add it's "start" position to the current items' positions
    startPositions.push({ left: lastItemPos.left + 10, top: lastItemPos.top });

    // append the item
    this._container.append(item);

    // calculate again this time the "finished" positions (including those of the newly appended item)
    // Read again. This forces a sync layout, so be careful.
    const endPositions = this._getStartPositions();

    item.style.opacity = 0; // for better look
    this._animate(startPositions, endPositions, this._container.children);
  }

  prependItem() {
    const startPositions = this._getStartPositions();

    if (!startPositions.length) {
      // TODO:
      return;
    }

    const firstItemPos = startPositions[0];

    // create a new item (not yet inserted)
    const item = this._createItem();

    // add it position to the current items' positions
    startPositions.unshift({
      left: firstItemPos.left - 10,
      top: firstItemPos.top
    });

    // prepend the item
    this._container.prepend(item);

    // calculate again this time the "finished" positions (including those of the newly prepended item)
    // Read again. This forces a sync layout, so be careful.
    const endPositions = this._getStartPositions();

    item.style.opacity = 0; // for better look
    this._animate(startPositions, endPositions, this._container.children);
  }

  /**
   *
   * @param {HTMLElement} el
   */
  _removeItem(el) {
    el.remove();
  }

  /**
   * @return {HTMLElement}
   */
  _createItem() {
    const item = document.createElement("li");
    item.innerHTML = "New Item " + ++this._count;
    addClass(item, "item");
    this._addRemoveListener(item);
    return item;
  }

  _addRemoveListener(el) {
    el.addEventListener("dblclick", this._removeItem.bind(this, el));
  }

  // FLIP Animation logic

  /**
   * @return {{left:Number, top:number}[]}
   */
  _getStartPositions() {
    const startPositions = [];

    for (const item of this._container.children) {
      let rect = item.getBoundingClientRect();
      startPositions.push({ left: rect.left, top: rect.top });
    }

    return startPositions;
  }

  /**
   *
   * @param {{left:Number, top:number}[]} startPositions
   * @param {{left:Number, top:number}[]} endPositions
   * @param {HTMLCollection} children
   */
  _animate(startPositions, endPositions, children) {
    if (
      startPositions.length !== endPositions.length ||
      startPositions.length !== children.length
    ) {
      throw new Error("Invalid animation data");
    }

    for (let i = 0; i < children.length; i++) {
      const item = children[i];

      // Get the first position.
      const startPosition = startPositions[i];

      // Read again. This forces a sync layout, so be careful.
      const endPosition = endPositions[i];

      // You can do this for other computed styles as well, if needed.
      // Just be sure to stick to compositor-only props like transform
      // and opacity where possible.
      const invertX = ~~(startPosition.left - endPosition.left);
      const invertY = ~~(startPosition.top - endPosition.top);

      // Invert.
      if (invertX || invertY) {
        item.style.transform = `translateX(${invertX}px) translateY(${invertY}px)`;
      }
    }

    // ensure we're not running duplicate requestAnimationFrames
    if (this._animationRequestID)
      window.cancelAnimationFrame(this._animationRequestID);

    // Wait for the next frame so we know all the style changes have taken hold.
    this._animationRequestID = window.requestAnimationFrame(() => {
      let lastItem;
      for (const item of this._container.children) {
        lastItem = item;

        // Switch on animations transforms
        // .animate-on-transforms {
        //    transition: all 0.3s ease;
        // }
        addClass(item, "animate-on-transforms");

        // GO GO GOOOOOO! - this will trigger the transform animation
        item.style.transform = "";
        item.style.opacity = "";
      }

      // Capture the animation end on *only* the last element with transitionend
      const listener = () => {
        lastItem.removeEventListener("transitionend", listener);
        this._onAnimateComplete();
      };
      lastItem.addEventListener("transitionend", listener);
    });
  }

  _onAnimateComplete() {
    for (const item of this._container.children) {
      removeClass(item, "animate-on-transforms");
    }

    if (this._animationRequestID) {
      window.cancelAnimationFrame(this._animationRequestID);
      this._animationRequestID = null;
    }
  }
}
