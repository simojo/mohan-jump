const tileMapKey = {
  "0": "air",
  "1": "ground",
  "2": "box",
  "3": "",
  "4": "",
  "5": "",
  "7": "",
  "8": "startpoint",
  "9": "endpoint"
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
function drawTileMap(tilemap) {
  // clear the screen of any elements
  document.body.innerHTML = "";

  let container = document.createElement("div");
  container.id = "container";
  container.style.position = "absolute";
  container.style.height = "100%";
  container.style.width = "100%";
  container.style.top = "0px";
  container.style.left = "0px";
  container.style.padding = "0px";
  container.style.margin = "0px";
  document.body.appendChild(container);

  // create the background
  let background = document.createElement("img");
  background.src = "./imgs/background.png";
  background.id = "background";
  background.style.position = "absolute";
  background.style.top = "0px";
  background.style.left = "0px";
  background.style.height = "100%";
  background.style.width = "100%";
  container.appendChild(background);

  // create the foreground
  let canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.style.position = "absolute";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  // get size of tilemap
  let canvasWidth = tilemap.split("\n")[1].split("").length * tileSideLength;
  let canvasHeight = tilemap.split("\n").length * tileSideLength;
  // set sizing props for pixel scaling
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  // set sizing props for overflow styling
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  canvas.style.overflow = "hidden";
  // get drawing context
  let context = canvas.getContext("2d");
  container.appendChild(canvas);

  // secretly load in all of the images beforehand
  let imageEnvelope = document.createElement("div");
  imageEnvelope.style.display = "none";
  document.body.appendChild(imageEnvelope);
  Object.keys(tileMapKey)
    .filter(tileID => ["", "air"].includes(tileMapKey[tileID]) === false)
    .forEach(tileID => {
      let tileImg = document.createElement("img");
      tileImg.src = `./imgs/${tileMapKey[tileID]}.png`;
      tileImg.addEventListener("load", () => {
        console.log(`image [${tileID}] loaded`);
      });
      tileImg.id = tileMapKey[tileID];
      imageEnvelope.appendChild(tileImg);
  });

  let currentX = 0;
  let currentY = 0;
  // iterate through all lines of tilemap string
  tilemap.split("\n").forEach((line) => {
    // iterate through all characters of tilemap line and create the corresponding tile
    line.split("").forEach((tileID) => {
      // handle different tile sizes differently, defaulting to square
      // closures are necessary to capture current x and y values with a dynamic scoping
      let thisImage = document.getElementById(tileMapKey[tileID]);
      switch(tileMapKey[tileID]) {
        case "":
          // nonexistent block; draw nothing
          break;
        case "air":
          // air block; draw nothing
          break;
        case "startpoint":
          (function (thisImage, currentX, currentY) {
            thisImage.addEventListener("load", () => {
              context.drawImage(thisImage, currentX, currentY - tileSideLength, tileSideLength, 2 * tileSideLength);
            });
          }(thisImage, currentX, currentY));
          break;
        case "endpoint":
          (function (thisImage, currentX, currentY) {
            thisImage.addEventListener("load", () => {
              context.drawImage(thisImage, currentX, currentY - tileSideLength, tileSideLength, 2 * tileSideLength);
            });
          }(thisImage, currentX, currentY));
          break;
        default:
          (function (thisImage, currentX, currentY) {
            thisImage.addEventListener("load", () => {
              context.drawImage(thisImage, currentX, currentY, tileSideLength, tileSideLength);
            });
          }(thisImage, currentX, currentY));
          break;
      }
      currentX += tileSideLength;
    });
    currentY += tileSideLength;
    currentX = 0;
  });
}

let playerWidth = tileSideLength - 10;
let playerHeight = 2 * playerWidth;

// aligns the view of the level based upon where the player is
function alignView(player) {
  let canvas = document.getElementById("canvas");
}

// draws the player
function drawPlayer(player) {
  let sprite = document.getElementById("sprite");
  // create a sprite if it does not exist
  if (sprite === null || sprite === undefined) {
    sprite = document.createElement("img");
    sprite.style.position = "absolute";
    sprite.src = "./imgs/player.png";
    sprite.id = "sprite";
    sprite.style.width = `${playerWidth}px`;
    sprite.style.height = `${playerHeight}px`;
    document.getElementById("container").appendChild(sprite);

    // place sprite in start point location
    let startPoint = levelTileCoords.filter(tileCoord => tileCoord.id === 8)[0];
    player.x = startPoint.x;
    player.y = startPoint.y - tileSideLength;
  }
  sprite.style.left = `${player.x}px`;
  sprite.style.top = `${player.y}px`;
}
