// store all keys currently pressed
let keysPressed = {};

addEventListener("keydown", (e) => {
  keysPressed[e.keyCode] = true;
});

addEventListener("keyup", (e) => {
  delete keysPressed[e.keyCode];
});

// https://keycode.info
function input() {
  // A or left arrow
  if (65 in keysPressed || 37 in keysPressed) {
    player.x -= 5;
  }
  // W or up arrow
  if (87 in keysPressed || 38 in keysPressed) {
    player.y -= 5;
  }
  // D or right arrow
  if (68 in keysPressed || 39 in keysPressed) {
    player.x += 5;
    console.log(player);
  }
  // S or down arrow
  if (83 in keysPressed || 40 in keysPressed) {
    player.y += 5;
    // FIXME: velocity downwards
  }
  // Q
  if (81 in keysPressed) {
    console.log("Q")
    // FIXME: quit
  }
}
