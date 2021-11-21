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

// draws the entire level tiles using the tilemap
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

  // Increment the position based upon velocity
  let playerBottom = player.y + playerHeight;
  let playerRight = player.x + playerWidth;

  if (
    !(// ensure no collision on the left side
      Math.sign(player.vx) === -1 && levelTileCoords.some((tileCoord) =>
        !([0, 8, 9].includes(tileCoord.id))
        && (player.y <= tileCoord.y && playerBottom >= tileCoord.y
        || player.y <= tileCoord.y + tileSideLength && playerBottom >= tileCoord.y + tileSideLength)
        && Math.abs(player.x - (tileCoord.x + tileSideLength)) <= velocityCap
      )
    )
    &&
    !(// ensure no collision on the right side
      Math.sign(player.vx) === 1 && levelTileCoords.some((tileCoord) =>
        !([0, 8, 9].includes(tileCoord.id))
        && (player.y <= tileCoord.y && playerBottom >= tileCoord.y
        || player.y <= tileCoord.y + tileSideLength && playerBottom >= tileCoord.y + tileSideLength)
        && Math.abs(tileCoord.x - playerRight) <= velocityCap
      )
    )
  ) {
    player.x += player.vx;
    sprite.style.left = `${player.x}px`;
  }

  if (
    !(// ensure no collision on the top side
      Math.sign(player.vy) === -1 && levelTileCoords.some((tileCoord) =>
        !([0, 8, 9].includes(tileCoord.id))
        && (player.x <= tileCoord.x && playerRight >= tileCoord.x
        || player.x <= tileCoord.x + tileSideLength && playerRight >= tileCoord.x + tileSideLength
        || player.x >= tileCoord.x && playerRight <= tileCoord.x + tileSideLength)
        && Math.abs(player.y - (tileCoord.y + tileSideLength)) <= velocityCap
      )
    )
    &&
    !(// ensure no collision on the bottom side
      Math.sign(player.vy) === 1 && levelTileCoords.some((tileCoord) =>
        !([0, 8, 9].includes(tileCoord.id))
        && (player.x <= tileCoord.x && playerRight >= tileCoord.x
        || player.x <= tileCoord.x + tileSideLength && playerRight >= tileCoord.x + tileSideLength
        || player.x >= tileCoord.x && playerRight <= tileCoord.x + tileSideLength)
        && Math.abs(tileCoord.y - playerBottom) <= velocityCap
      )
    )
  ) {
    player.y += player.vy;
    sprite.style.top = `${player.y}px`;
  }
}
