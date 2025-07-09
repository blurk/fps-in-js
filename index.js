/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const WIDTH = 300,
  HALF_WIDTH = 150;
const HEIGHT = 200,
  HALF_HEIGHT = 100;

const FPS = 60;
const cycleDelay = Math.floor(1000 / FPS); // Round down to interger
let oldCycleTime = 0;
let cycleCount = 0;
let fpsRate = "...";

// map
const MAP_SIZE = 32;
const MAP_SCALE = 64;
const MAP_RANGE = MAP_SCALE * MAP_SIZE;
const MAP_SPEED = MAP_SCALE / 2 / 10;
const MAP = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,14, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,14, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
  1, 1, 1,15, 0,15, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2,
  1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2,14, 0,14, 2, 2, 2, 2, 2, 2, 2,
  1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2,
  1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 1, 1,14, 0,14, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,11,11,11, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 0, 0, 0, 1,
  1, 0,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,11,11,11,11, 0, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

let showMap = false;

// Player
let playerX = MAP_SCALE + 20;
let playerY = MAP_SCALE + 20;
let playerAngle = Math.PI / 3;
let playerMoveX = 0;
let playerMoveY = 0;
let playerMoveAngle = 0;

// Handle user input
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "s": {
      playerMoveX = -1;
      playerMoveY = -1;
      break;
    }
    case "w": {
      playerMoveX = 1;
      playerMoveY = 1;
      break;
    }
    case "a": {
      playerMoveAngle = 1;
      break;
    }
    case "d": {
      playerMoveAngle = -1;
      break;
    }
    case "m": {
      showMap = true;
      break
    }
  }
});

document.addEventListener("keyup", function (event) {
  switch (event.key) {
    case "s":
    case "w": {
      playerMoveX = 0;
      playerMoveY = 0;
      break;
    }
    case "a":
    case "d": {
      playerMoveAngle = 0;
      break;
    }
    case "m": {
      showMap = false;
      break
    }
  }
});

// camera
const DOUBLE_PI = Math.PI * 2;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const STEP_ANGLE = FOV / WIDTH;

// graphics
const WALLS = []

// load wall texture
for (let i = 0; i < 14; i++) {
  const image = document.createElement('img')
  image.src = "/assets/walls/" + i + ".png"
  WALLS.push(image)
}

// Game Loop
function gameLoop() {
  // calculate FPS
  cycleCount++;
  if (cycleCount >= 60) cycleCount = 0;
  let startTime = Date.now();
  let cycleTime = startTime - oldCycleTime;
  oldCycleTime = startTime;

  if (cycleCount % 60 === 0) fpsRate = Math.floor(1000 / cycleTime);

  // canvas resizing
  canvas.width = window.innerWidth * 0.3;
  canvas.height = window.innerHeight * 0.3;

  // Update player position
  let playerOffsetX = Math.sin(playerAngle) * MAP_SPEED;
  let playerOffsetY = Math.cos(playerAngle) * MAP_SPEED;
  let mapTargetX =
    Math.floor(playerY / MAP_SCALE) * MAP_SIZE +
    Math.floor((playerX + playerOffsetX * playerMoveX * 10) / MAP_SCALE);
  let mapTargetY =
    Math.floor((playerY + playerOffsetY * playerMoveY * 10) / MAP_SCALE) * MAP_SIZE +
    Math.floor(playerX / MAP_SCALE);

  // Collision
  if (playerMoveX && MAP[mapTargetX] == 0)
    playerX += playerOffsetX * playerMoveX;

  if (playerMoveY && MAP[mapTargetY] == 0)
    playerY += playerOffsetY * playerMoveY;

  if (playerMoveAngle) playerAngle += 0.03 * playerMoveAngle;

  // map and player offset
  const mapOffsetX = Math.floor(canvas.width / 2) - HALF_WIDTH;
  const mapOffsetY = Math.floor(canvas.height / 2) - HALF_HEIGHT;
  let playerMapX = (playerX / MAP_SCALE) * 5 + mapOffsetX;
  let playerMapY = (playerY / MAP_SCALE) * 5 + mapOffsetY;

  // draw floor and celling
  context.drawImage(WALLS[0], canvas.width / 2 - HALF_WIDTH, canvas.height / 2 - HALF_HEIGHT)

  // Raycasting
  let currentAngle = playerAngle + HALF_FOV;
  let rayStartX = Math.floor(playerX / MAP_SCALE) * MAP_SCALE;
  let rayStartY = Math.floor(playerY / MAP_SCALE) * MAP_SCALE;

  for (let ray = 0; ray < WIDTH; ray++) {
    let currentSin = Math.sin(currentAngle);
    currentSin = currentSin ? currentSin : 0.000001;

    let currentCos = Math.cos(currentAngle);
    currentCos = currentCos ? currentCos : 0.000001;

    // vertical line intersection
    let rayEndX, rayEndY, rayDirectionX, verticalDepth, textureEndY, textureY;
    if (currentSin > 0) {
      rayEndX = rayStartX + MAP_SCALE;
      rayDirectionX = 1;
    } else {
      rayEndX = rayStartX;
      rayDirectionX = -1;
    }

    for (let offset = 0; offset < MAP_RANGE; offset += MAP_SCALE) {
      verticalDepth = (rayEndX - playerX) / currentSin;
      rayEndY = playerY + verticalDepth * currentCos;

      let mapTargetX = Math.floor(rayEndX / MAP_SCALE);
      let mapTargetY = Math.floor(rayEndY / MAP_SCALE);

      if (currentSin <= 0) mapTargetX += rayDirectionX;

      const targetSquare = mapTargetY * MAP_SIZE + mapTargetX;
      if (targetSquare < 0 || targetSquare > MAP.length - 1) break;
      if (MAP[targetSquare] != 0) {
        textureY = MAP[targetSquare];
        if (MAP[targetSquare] === 14) textureY = 1;
        if (MAP[targetSquare] === 15) textureY = 5;

        break;
      }

      rayEndX += rayDirectionX * MAP_SCALE;
    }
    textureEndY = rayEndY

    // horizontal intersection
    let rayDirectionY, horizontalDepth, textureEndX, textureX;

    if (currentCos > 0) {
      rayEndY = rayStartY + MAP_SCALE;
      rayDirectionY = 1;
    } else {
      rayEndY = rayStartY;
      rayDirectionY = -1;
    }

    for (let offset = 0; offset < MAP_RANGE; offset += MAP_SCALE) {
      horizontalDepth = (rayEndY - playerY) / currentCos;
      rayEndX = playerX + horizontalDepth * currentSin;

      let mapTargetX = Math.floor(rayEndX / MAP_SCALE);
      let mapTargetY = Math.floor(rayEndY / MAP_SCALE);

      if (currentCos <= 0) mapTargetY += rayDirectionY;

      const targetSquare = mapTargetY * MAP_SIZE + mapTargetX;
      if (targetSquare < 0 || targetSquare > MAP.length - 1) break;
      if (MAP[targetSquare] != 0) {

        textureX = MAP[targetSquare];
        if (MAP[targetSquare] === 14) textureX = 5;
        if (MAP[targetSquare] === 15) textureX = 1;
        break;
      }

      rayEndY += rayDirectionY * MAP_SCALE;
    }
    textureEndX = rayEndX

    // calc 3D projection
    let depth = verticalDepth < horizontalDepth ? verticalDepth : horizontalDepth
    depth *= Math.cos(playerAngle - currentAngle)

    let textureOffset = verticalDepth < horizontalDepth ? textureEndY : textureEndX;
    textureOffset = Math.floor(textureOffset - Math.floor(textureOffset / MAP_SCALE) * MAP_SCALE)

    let textureImage = verticalDepth < horizontalDepth ? textureY : textureX

    let wallHeight = Math.min(Math.floor(MAP_SCALE * 280 / (depth + 0.0001)), Number.MAX_SAFE_INTEGER)

    // render textures
    context.drawImage(
      WALLS[textureImage],
      textureOffset,
      0,
      1,
      64,
      mapOffsetX + ray,
      mapOffsetY + (HALF_HEIGHT - Math.floor(wallHeight / 2)),
      1,
      wallHeight
    )

    currentAngle -= STEP_ANGLE;
  }

  // draw 2D map
  if (showMap) {
    for (let row = 0; row < MAP_SIZE; row++) {
      for (let col = 0; col < MAP_SIZE; col++) {
        const square = row * MAP_SIZE + col;

        if (MAP[square] != 0) {
          const materialTexture = MAP[square] > 13 ? 1 : MAP[square]

          context.drawImage(
            WALLS[materialTexture],
            0,
            0,
            64,
            64,
            mapOffsetX + col * 5,
            mapOffsetY + row * 5,
            5,
            5
          )
        } else {
          context.fillStyle = "#aaa";
          context.fillRect(
            mapOffsetX + col * 5,
            mapOffsetY + row * 5,
            5,
            5
          );
        }
      }
    }

    // Player on 2D map
    context.fillStyle = "#f00";
    context.beginPath();
    context.arc(playerMapX, playerMapY, 2, 0, DOUBLE_PI);
    context.fill();
    context.strokeStyle = "#f00";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(playerMapX, playerMapY);
    context.lineTo(
      playerMapX + Math.sin(playerAngle) * 5,
      playerMapY + Math.cos(playerAngle) * 5
    );
    context.stroke();
  }

  // fix wall overflow
  context.fillStyle = "#fff"
  context.fillRect(0, 0, canvas.width, mapOffsetY)
  context.fillRect(0, canvas.height - mapOffsetY, canvas.width, mapOffsetY)

  setTimeout(gameLoop, cycleDelay);

  context.fillStyle = "#000";
  context.font = "16px Monospace";
  context.fillText("FPS: " + fpsRate, 0, 20);
}

window.addEventListener("load", gameLoop);
