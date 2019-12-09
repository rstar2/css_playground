import flip from "./flip.js";

const item = document.querySelector(".item");

function animate() {
  flip(item, { triggerAction: "animated", duration: 3000 });
}
setTimeout(animate, 3000);

const itemSelected = null;
/**
 * 
 * @param {HTMLElement} item 
 */
function clickListener(item) {
    if (itemSelected === item) return;

    if (item) {
        // Select new item
    } else {
        // Deselect current item
    }

    itemSelected = item;
}

const items = document.querySelectorAll(".item");
items.forEach(item => item.addEventListener("click", clickListener.bind(this, item)));

document.querySelector(".overlay").addEventListener("click", clickListener.bind(this, null));