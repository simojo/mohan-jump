// store all keys currently pressed
let keysPressed = {};

addEventListener("keydown", (e) => {
  keysPressed[e.keyCode] = true;
});

addEventListener("keyup", (e) => {
  delete keysPressed[e.keyCode];
  // jump button released, do not allow double jumps by exceeding jump ticks
  if ([87, 38, 32].includes(e.keyCode)) {
    jumpTicks = 100;
  }
});

// https://keycode.info
function input() {
  // Q
  if (81 in keysPressed) {
    makeTitleScreen();
  }
  // R
  if (82 in keysPressed) {
    document.getElementById("sprite").remove();
    player = JSON.parse(JSON.stringify(playerTemplate));
    popup("Restarting...", 1);
  }
}
