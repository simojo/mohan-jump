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

// draws the entire level tiles using the tilemap
function drawTileMap(tilemap) {
  let boxSideLength = 100;
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
      thisTile.style.width = `${boxSideLength}px`;
      thisTile.style.height = `${boxSideLength}px`;

      document.body.appendChild(thisTile);

      currentX += boxSideLength;
    });
    currentY += boxSideLength;
    currentX = 0;
  });
}

function drawPlayer(player) {
  let sprite = document.getElementById("sprite");
  if (sprite === null || sprite === undefined) {
    sprite = document.createElement("img");
    sprite.src = "./imgs/player.png";
    sprite.id = "sprite";
    sprite.style.width = "200px";
    sprite.style.height = "100px";
    document.body.appendChild(sprite);
  }
  sprite.style.left = `${player.x}px`;
  sprite.style.top = `${player.y}px`;
}
