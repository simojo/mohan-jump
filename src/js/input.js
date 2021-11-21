// store all keys currently pressed
let keysPressed = {};

addEventListener("keydown", (e) => {
  keysPressed[e.keyCode] = true;
});

addEventListener("keyup", (e) => {
  delete keysPressed[e.keyCode];
});

let velocityCap = 7;

// https://keycode.info
function input() {
  // Q
  if (81 in keysPressed) {
    makeTitleScreen();
  }
}
