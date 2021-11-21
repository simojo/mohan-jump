window.onload = () => {
  main();
};

let player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0
};

let levels = [
  {
    tilemap: `
222222222222222222222222222222222222
200000020000000000000000000000000002
280000020000000000000000000000000002
211100020000000000000000000000000002
200000020000000000000000000000000002
200000020000000000000000000000000002
200111000000200022000000220002000002
200000000200000000000000000000000002
200000002200000000000000000000000002
211100022200000000000000000000000002
200000222200000000000000000000000902
111111111100000000000000000000001111
`,
    name: "1"
  },
  {
    tilemap: `
2222222222222222
2000002000000002
2800002000000092
2220002000000222
2000002000020002
2000002000000002
2022222000200002
2000000000000002
2000000002000002
2000000000000002
1111111111111111
`,
    name: "2"
  },
  {
    tilemap: `
222222222222222222222222222222222
200000000000000000000000000000002
200000000000000800000000000000002
200000000000022222000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000020002
200000000000000000000000000020002
200000000000000000000000000020002
200000000000022222222222222220002
200000000000020000000000000000002
200000000000020900000000000000002
222222222222222222222222222222222
`,
    name: "3"
  }
];

let level = undefined;
let levelTileCoords = undefined;

function main() {
  makeTitleScreen();
}

function makeTitleScreen() {
  level = undefined;
  levelTileCoords = undefined;
  document.body.innerHTML = "";

  // create the title screen itself
  let titleScreen = document.createElement("div");
  titleScreen.id = "title-screen";
  let title = document.createElement("h1");
  title.innerHTML = "Mohan Jump";
  titleScreen.appendChild(title);
  document.body.appendChild(titleScreen);

  // add the level selectors
  levels.forEach((thisLevel) => {
    let levelElement = document.createElement("div");
    levelElement.classList.add("level-select");
    levelElement.onclick = () => {
      level = JSON.parse(JSON.stringify(thisLevel)); // deep copy
      drawTileMap(level.tilemap);
      levelTileCoords = createLevelTileCoords(level.tilemap);
      eventLoop();
    };
    levelElement.innerHTML = thisLevel.name;
    titleScreen.appendChild(levelElement);
  });
}

function eventLoop() {
  if (level === undefined) { return; }
  drawPlayer(player);
  input();
  playerMechanics();
  requestAnimationFrame(eventLoop);
}

let velocityCap = 7;
let jumpTicks = 0; // counts how many cycles the jump button has been pressed; helps prevents double jumps

function playerMechanics() {
  // Increment the position based upon velocity
  let playerBottom = player.y + playerHeight;
  let playerRight = player.x + playerWidth;

  if (
    !(// ensure no collision on the left side
      Math.sign(player.vx) === -1 && levelTileCoords.some((tileCoord) =>
        !([0, 8, 9].includes(tileCoord.id))
        && (player.y <= tileCoord.y && playerBottom >= tileCoord.y
        || player.y <= tileCoord.y + tileSideLength && playerBottom >= tileCoord.y + tileSideLength)
        && Math.abs(player.x - (tileCoord.x + tileSideLength)) <= Math.abs(player.vx)
      )
    )
    &&
    !(// ensure no collision on the right side
      Math.sign(player.vx) === 1 && levelTileCoords.some((tileCoord) =>
        !([0, 8, 9].includes(tileCoord.id))
        && (player.y <= tileCoord.y && playerBottom >= tileCoord.y
        || player.y <= tileCoord.y + tileSideLength && playerBottom >= tileCoord.y + tileSideLength)
        && Math.abs(tileCoord.x - playerRight) <= Math.abs(player.vx)
      )
    )
  ) {
    // translate with velocity
    player.x += player.vx;
  }

  if (
    !(// ensure no collision on the top side
      Math.sign(player.vy) === -1 && levelTileCoords.some((tileCoord) =>
        !([0, 8, 9].includes(tileCoord.id))
        && (player.x <= tileCoord.x && playerRight >= tileCoord.x
        || player.x <= tileCoord.x + tileSideLength && playerRight >= tileCoord.x + tileSideLength
        || player.x >= tileCoord.x && playerRight <= tileCoord.x + tileSideLength)
        && Math.abs(player.y - (tileCoord.y + tileSideLength)) <= Math.abs(player.vy)
      )
    )
  ) {
    if (Math.sign(player.vy) === -1) {
      // translate with velocity
      player.y += player.vy;
    }
  }

  if (
    !(// ensure no collision on the bottom side
      Math.sign(player.vy) === 1 && levelTileCoords.some((tileCoord) =>
        !([0, 8, 9].includes(tileCoord.id))
        && (player.x <= tileCoord.x && playerRight >= tileCoord.x
        || player.x <= tileCoord.x + tileSideLength && playerRight >= tileCoord.x + tileSideLength
        || player.x >= tileCoord.x && playerRight <= tileCoord.x + tileSideLength)
        && Math.abs(tileCoord.y - playerBottom) <= Math.abs(player.vy)
      )
    )
  ) {
    if (Math.sign(player.vy) === 1) {
      // translate with velocity
      player.y += player.vy;
    }
    // gravity
    player.vy += 5;
  } else {
    // ground collisions reset velocity (sorry, conservation of momentum...)
    player.vy = 0;
    // reset jump ticks because we've landed again
    jumpTicks = 0;
  }

  let movementKeyPressed = false;
  // A or left arrow
  if (65 in keysPressed || 37 in keysPressed) {
    player.vx -= 1;
    movementKeyPressed = true;
  }
  // W or up arrow or Space
  if (87 in keysPressed || 38 in keysPressed || 32 in keysPressed) {
    if (jumpTicks < 20) {
      player.vy -= 20;
      movementKeyPressed = true;
      jumpTicks += 1;
    }
  }
  // D or right arrow
  if (68 in keysPressed || 39 in keysPressed) {
    player.vx += 1;
    movementKeyPressed = true;
  }
  // S or down arrow
  if (83 in keysPressed || 40 in keysPressed) {
    player.vy += 1;
    movementKeyPressed = true;
  }

  if (!movementKeyPressed && player.vx !== 0) {
    player.vx -= Math.sign(player.vx) * 1;
  }

  // cap velocity
  player.vx = Math.abs(player.vx) > velocityCap ? velocityCap * Math.sign(player.vx) : player.vx;
  player.vy = Math.abs(player.vy) > velocityCap ? velocityCap * Math.sign(player.vy) : player.vy;
}
