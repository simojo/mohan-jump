// store all keys currently pressed
let keysPressed {};

addEventListener("keydown", (e) => {
  keysDown[e.keyCode] = true;
});

addEventListener("keyup", (e) => {
  delete keysDown[e.keyCode];
});

// https://keycode.info
function input() {
  // A or left arrow
  if (65 in keysDown || 37 in keysDown) {
    player.x -= 5;
  }
  // W or up arrow
  if (87 in keysDown || 38 in keysDown) {
    player.y += 5;
  }
  // D or right arrow
  if (68 in keysDown || 39 in keysDown) {
    player.x += 5;
  }
  // S or down arrow
  if (83 in keysDown || 40 in keysDown) {
    player.y -= 5;
    // FIXME: velocity downwards
  }
  // Q
  if (81 in keysDown) {
    // FIXME: quit
  }
}
