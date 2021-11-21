const tileMapKey = {
  0: "air",
  1: "ground",
  2: "box",
  3: "",
  4: "",
  5: "",
  7: "",
  8: "startpoint",
  9: "endpoint"
};

let tileSideLength = 50;

// maps all of the tiles to tangible coordinates for collision detection
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

// draws the entire level tiles using the tilemap
// FIXME: 2d canvas
function drawTileMap(tilemap) {
  // clear the screen of any elements
  document.body.innerHTML = "";

  let currentX = 0;
  let currentY = 0;
  // iterate through all lines of tilemap string
  tilemap.split("\n").forEach((line) => {
    // iterate through all characters of tilemap line and create the corresponding tile
    line.split("").forEach((tileID) => {
      let thisTile = document.createElement("div");
      thisTile.classList.add("tile");
      thisTile.classList.add(tileMapKey[parseInt(tileID)]);
      thisTile.style.top = `${currentY}px`;
      thisTile.style.left = `${currentX}px`;
      thisTile.style.width = `${tileSideLength}px`;
      thisTile.style.height = `${tileSideLength}px`;

      // add the tile to the scene
      document.body.appendChild(thisTile);

      currentX += tileSideLength;
    });
    currentY += tileSideLength;
    currentX = 0;
  });
}

let playerWidth = tileSideLength - 10;
let playerHeight = 2 * playerWidth;

function drawPlayer(player) {
  let sprite = document.getElementById("sprite");
  // create a sprite if it does not exist
  if (sprite === null || sprite === undefined) {
    sprite = document.createElement("img");
    sprite.src = "./imgs/player.png";
    sprite.id = "sprite";
    sprite.style.width = `${playerWidth}px`;
    sprite.style.height = `${playerHeight}px`;
    document.body.appendChild(sprite);

    // place sprite in start point location
    let startPoint = levelTileCoords.filter(tileCoord => tileCoord.id === 8)[0];
    player.x = startPoint.x;
    player.y = startPoint.y - tileSideLength;
  }
  sprite.style.left = `${player.x}px`;
  sprite.style.top = `${player.y}px`;
}
