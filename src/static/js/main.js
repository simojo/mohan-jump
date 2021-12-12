window.onload = () => {
  main();
};

// used to reset the player
const playerTemplate = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0
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
200111000000200020020020020020000002
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
200111100000000000000000000000002
200000000000000000000000000000002
201000000000000000000000000000002
200000000000000000000000000000002
210000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200001000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000000000000000000000000002
200000000100100100100100100000002
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
  },
  {
    tilemap: `
00000002222222222222222222222222000000
22222222000000000002000000000002222222
20000002000000000002000000000002000002
20800002000002000002000000000002000002
22220002200002000002000000000002200202
20000002000002000002000000000002000202
20000002000022000002000000222202002202
20000002000002000002000000000202000202
20002222200002000002022000000202200202
20000000000022000002000000000202000202
20000000000002000002000000020202002202
22222222222222000002000000000202000202
00000000000000000002000222200202200202
00000000000000000002000000200202000202
20000000000000000002200000000202002202
20000000000000000002000000000202000202
20000022002002002022000200000202200202
20000020000000000002000000000202000202
20000020000000000002000000200202002202
20000020000000000002000000000202000202
20000022222222222222000000002202200202
20000000000000000000000000000202000202
20000000000000000000000000200200002202
22222222222222222222222222222200000202
00000000000000000000000000000222222202
00000000000000000000000000000000000000
00000000000000000000000000000000000000
00000000000000000000222222222222002220
00000000000000000000000000000002000000
00000000000000000000000000000002000000
00000000000000000000000000000002000000
00000000000002222000000000090002000000
00000000000000000000020000222002222222
`,
    name: "4"
  },
  {
    tilemap: `
11111111111111111111111111111111111111
10000000000000100000000000000000000001
10800000000000100000000000000000000001
11111111100000100000000000000000000000
10000000000000100000000000000001100000
10000000000000100000000000000000100000
10000000111111100000000000000100100090
10000000000000000000000000100000111111
10000000000000000000001000000000000000
11111111110001111111000000000000000000
`,
    name: "5"
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
  player = JSON.parse(JSON.stringify(playerTemplate));
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
      levelTileCoords = createLevelTileCoords(level.tilemap);
      drawTileMap(level.tilemap);
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

function popup(text, transition) {
  if (document.getElementById("popup") !== null) {
    return;
  }
  let overlay = document.createElement("div");
  overlay.id = "popup";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = 2;
  overlay.style.backgroundColor = "black";
  overlay.style.top = "0px";
  overlay.style.left = "0px";
  overlay.style.position = "absolute";
  overlay.style.color = "white";
  // NOTE: doesn't work; don't really care though
  overlay.style.transition = `opacity ${transition}s`;
  overlay.style.opacity = 0.0;
  let textElement = document.createElement("h1");
  textElement.style.left = "50%";
  textElement.style.top = "50%";
  textElement.style.fontSize = "100px";
  textElement.style.position = "absolute";
  textElement.style.transform = "translate(-50%, -100%)";
  textElement.innerHTML = text;
  overlay.appendChild(textElement);
  document.body.appendChild(overlay);
  overlay.style.opacity = 1.0;
  setTimeout(() => {
    let el = document.getElementById("popup");
    el.style.opacity = 0.0;
    el.remove();
  }, 500);
}

function playerMechanics() {
  // Increment the position based upon velocity
  let playerBottom = player.y + playerHeight;
  let playerRight = player.x + playerWidth;

  // check for player falling out of map
  if (playerBottom > level.tilemap.split("\n").length * tileSideLength + tileSideLength) {
    popup(["YOU DIED", "R.I.P", "You lost!!", "Better luck next time >:)"][Math.floor(Math.random() * 4)], 2);
    setTimeout(() => {
      makeTitleScreen();
    }, 1000);
  }

  let endpointBlock = levelTileCoords.filter(tileCoord => tileCoord.id === 9)[0];
  if (player.x >= endpointBlock.x && playerRight <= endpointBlock.x + tileSideLength && player.y >= endpointBlock.y - tileSideLength && player.y <= endpointBlock.y + tileSideLength) {
    popup("Level Complete!!", 2);
    setTimeout(() => {
      makeTitleScreen();
    }, 500);
  }

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
    player.vy += 1;
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
    if (jumpTicks < 6) {
      player.vy -= 3;
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
  // do not cap y velocity to leave acceleration in charge
}
