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

  // create the background
  let background = new Image();
  background.src = "./imgs/background.png";
  let backCanvas = document.createElement("canvas");
  backCanvas.id = "back-canvas";
  backCanvas.style.position = "absolute";
  backCanvas.style.top = "0px";
  backCanvas.style.left = "0px";
  backCanvas.style.width = "100%";
  let backgroundContext = backCanvas.getContext("2d")
  background.onload = () => { backgroundContext.drawImage(background, 0, 0); }
  document.body.appendChild(backCanvas);

  // create the foreground
  let canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.style.position = "absolute";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.style.width = "100%";
  let context = canvas.getContext("2d");
  document.body.appendChild(canvas);

  // load in all of the images into an array for easy drawing
  let images = Object.keys(tileMapKey).reduce((acc, tileID) => {
    if (["", "air"].includes(tileMapKey[tileID]) === false) {
      let tileImg = new Image();
      tileImg.src = `./imgs/${tileMapKey[tileID]}.png`;
      acc[tileID] = tileImg;
      tileImg.onload = () => { console.log(`image [${tileID}] loaded`); }
    }
    return acc;
  }, {});

  // FIXME: temporary unless above method definitely does not work
  // secretly load in all of the images beforehand
  let imageEnvelope = document.createElement("div");
  imageEnvelope.style.display = "none";
  document.body.appendChild(imageEnvelope);
  Object.keys(tileMapKey).forEach(tileID => {
    if (["", "air"].includes(tileMapKey[tileID]) === false) {
      let tileImg = document.createElement("img");
      tileImg.src = `./imgs/${tileMapKey[tileID]}.png`;
      tileImg.onload = () => { console.log(`image [${tileID}] loaded`); }
      tileImg.id = tileMapKey[tileID];
      imageEnvelope.appendChild(tileImg);
    }
  });

  let currentX = 0;
  let currentY = 0;
  // iterate through all lines of tilemap string
  tilemap.split("\n").forEach((line) => {
    // iterate through all characters of tilemap line and create the corresponding tile
    line.split("").forEach((tileID) => {
      // handle different tile sizes differently, defaulting to square
      // FIXME: these are not drawing!!!!
      switch(tileMapKey[tileID]) {
        case "":
          break;
        case "air":
          break;
        case "startpoint":
          images[tileID].addEventListener("load", () => {
            context.drawImage(images[tileID], currentX, currentY - tileSideLength, tileSideLength, 2 * tileSideLength);
          });
          break;
        case "endpoint":
          images[tileID].addEventListener("load", () => {
            context.drawImage(images[tileID], currentX, currentY - tileSideLength, tileSideLength, 2 * tileSideLength);
          });
          break;
        default:
          images[tileID].addEventListener("load", () => {
            context.drawImage(images[tileID], currentX, currentY, tileSideLength, tileSideLength);
          });
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
