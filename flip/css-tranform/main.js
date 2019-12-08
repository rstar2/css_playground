import Container from "./Container.js";

const container = new Container(document.querySelector(".container"));

/**
 *
 * @param {Boolean} isPrepend
 * @param {Event} event
 */
const clickListener = (isPrepend, event) => {
  event.preventDefault();
  isPrepend ? container.prependItem() : container.appendItem();
};

document
  .querySelector(".button[data-action=prepend-item]")
  .addEventListener("click", clickListener.bind(this, true));

document
  .querySelector(".button[data-action=append-item]")
  .addEventListener("click", clickListener.bind(this, false));
