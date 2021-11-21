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
200111000000000022000000220000000002
200000000200000000000000000000000002
200000002200000000000000000000000002
211100022200000000000000000000000002
200000222200000000000000000000000902
111111111111111221111112211111111111
`,
    name: "1"
  },
  {
    tilemap: `
2222222222222222
2000002000000002
2800002000000092
2220002000000222
2000002000220002
2000002000000002
2200002002200002
2000002000000002
2022222002220002
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
  document.body.innerHTML = "";

  // create the title screen itself
  let titleScreen = document.createElement("div");
  titleScreen.id = "title-screen";
  let title = document.createElement("h1");
  title.innerHTML = "Mohan Jump";
  titleScreen.appendChild(title);
  document.body.appendChild(titleScreen);

  // add the level selectors
  levels.forEach((level) => {
    let levelElement = document.createElement("div");
    levelElement.classList.add("level-select");
    levelElement.onclick = () => {
      drawTileMap(level.tilemap);
      levelTileCoords = createLevelTileCoords(level.tilemap);
      eventLoop();
    };
    levelElement.innerHTML = level.name;
    titleScreen.appendChild(levelElement);
  });
}

function createLevelTileCoords(tilemap) {
  let result = [];

  let currentX = 0;
  let currentY = 0;
  // iterate through all lines of tilemap string
  tilemap.split("\n").forEach((line) => {
    // iterate through all characters of tilemap line and create the corresponding tile
    line.split("").forEach((tileID) => {
      result.push({
        id: parseInt(tileID),
        x: currentX,
        y: currentY
      });
      currentX += tileSideLength;
    });
    currentY += tileSideLength;
    currentX = 0;
  });
  return result;
}

function eventLoop() {
  drawPlayer(player);
  input();
  playerMechanics();
  requestAnimationFrame(eventLoop);
}

function playerMechanics() {
  let movementKeyPressed = false;
  // A or left arrow
  if (65 in keysPressed || 37 in keysPressed) {
    player.vx -= 1;
    movementKeyPressed = true;
  }
  // W or up arrow
  if (87 in keysPressed || 38 in keysPressed) {
    // FIXME replace with gravity/jumping
    player.vy -= 1;
    movementKeyPressed = true;
  }
  // D or right arrow
  if (68 in keysPressed || 39 in keysPressed) {
    player.vx += 1;
    movementKeyPressed = true;
  }
  // S or down arrow
  if (83 in keysPressed || 40 in keysPressed) {
    // FIXME replace with gravity/jumping
    player.vy += 1;
    movementKeyPressed = true;
  }
  // Space
  if (32 in keysPressed) {
    player.vy -= 4;
  }

  if (!movementKeyPressed && player.vx !== 0) {
    player.vx -= Math.sign(player.vx) * 1;
  }

  // FIXME replace with gravity/jumping
  if (!movementKeyPressed && player.vy !== 0) {
    player.vy -= Math.sign(player.vy) * 1;
  }

  // cap velocity
  player.vx = Math.abs(player.vx) > velocityCap ? velocityCap * Math.sign(player.vx) : player.vx;
  player.vy = Math.abs(player.vy) > velocityCap ? velocityCap * Math.sign(player.vy) : player.vy;
}
