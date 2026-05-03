  import { animate, scroll } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm"


const arrow = document.querySelector(".arrow-sketchy-animated-spring");
const shaft = arrow.querySelector(".shaft");
const tip = arrow.querySelector(".tip");

const SPRING_CONFIG = {
  type: 'spring',
  stiffness: 300,
  damping: 12,
};


arrow.addEventListener("pointerenter", (event) => {
  if (checkPrefersReducedMotion()) {
    return;
  }

  animate(shaft, {
    d: `
        M 5,12
        h 17
      `,
  }, SPRING_CONFIG);
  animate(tip, {
    d: `
        M 15,7
        l 7,5
        l -7,5
      `,
  }, SPRING_CONFIG);

  // event based - triggered once
  // Wait a brief moment, and then revert
  // to the default arrow shape:
  window.setTimeout(() => {
    animate(shaft, {
      d: `
        M 5,12
        h 14
      `,
    }, SPRING_CONFIG);
    animate(tip, {
      d: `
        M 12,5
        l 7,7
        l -7,7
      `,
    }, SPRING_CONFIG);
  }, 150);
});

// state base
// arrow.addEventListener("mouseleave", (event) => {
//   if (checkPrefersReducedMotion()) {
//     return;
//   }

//   animate(shaft, {
//     d: `
//         M 5,12
//         h 14
//       `,
//   }, SPRING_CONFIG);
//   animate(tip, {
//     d: `
//         M 12,5
//         l 7,7
//         l -7,7
//       `,
//   }, SPRING_CONFIG);
// });

function checkPrefersReducedMotion() {
  return !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}
