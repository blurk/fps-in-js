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
const MAP_SIZE = 16;
const MAP_SCALE = 10;
const MAP_RANGE = MAP_SCALE * MAP_SIZE;
const MAP_SPEED = MAP_SCALE / 2 / 10;
const MAP = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

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
    case "ArrowDown": {
      playerMoveX = -1;
      playerMoveY = -1;
      break;
    }
    case "ArrowUp": {
      playerMoveX = 1;
      playerMoveY = 1;
      break;
    }
    case "ArrowLeft": {
      playerMoveAngle = 1;
      break;
    }
    case "ArrowRight": {
      playerMoveAngle = -1;
      break;
    }
  }
});

document.addEventListener("keyup", function (event) {
  switch (event.key) {
    case "ArrowDown":
    case "ArrowUp": {
      playerMoveX = 0;
      playerMoveY = 0;
      break;
    }
    case "ArrowLeft":
    case "ArrowRight": {
      playerMoveAngle = 0;
      break;
    }
  }
});

// camera
const DOUBLE_PI = Math.PI * 2;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const STEP_ANGLE = FOV / WIDTH;

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

  // Update screen
  context.fillStyle = "#000";
  context.fillRect(
    canvas.width / 2 - HALF_WIDTH,
    canvas.height / 2 - HALF_HEIGHT,
    WIDTH,
    HEIGHT
  );

  // Update player position
  let playerOffsetX = Math.sin(playerAngle) * MAP_SPEED;
  let playerOffsetY = Math.cos(playerAngle) * MAP_SPEED;
  let mapTargetX =
    Math.floor(playerY / MAP_SCALE) * MAP_SIZE +
    Math.floor((playerX + playerOffsetX * playerMoveX) / MAP_SCALE);
  let mapTargetY =
    Math.floor((playerY + playerOffsetY * playerMoveY) / MAP_SCALE) * MAP_SIZE +
    Math.floor(playerX / MAP_SCALE);

  if (playerMoveX && MAP[mapTargetX] == 0)
    playerX += playerOffsetX * playerMoveX;

  if (playerMoveY && MAP[mapTargetY] == 0)
    playerY += playerOffsetY * playerMoveY;

  if (playerMoveAngle) playerAngle += 0.03 * playerMoveAngle;

  // map and player offset
  const mapOffsetX = Math.floor(canvas.width / 2 - MAP_RANGE / 2);
  const mapOffsetY = Math.floor(canvas.height / 2 - MAP_RANGE / 2);
  let playerMapX = playerX + mapOffsetX;
  let playerMapY = playerY + mapOffsetY;

  // draw 2D map
  for (let row = 0; row < MAP_SIZE; row++) {
    for (let col = 0; col < MAP_SIZE; col++) {
      const square = row * MAP_SIZE + col;

      context.fillStyle = MAP[square] != 0 ? "#555" : "#aaa";
      context.fillRect(
        mapOffsetX + col * MAP_SCALE,
        mapOffsetY + row * MAP_SCALE,
        MAP_SCALE,
        MAP_SCALE
      );
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
    let rayEndX, rayEndY, rayDirectionX, verticalDepth;
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
      if (MAP[targetSquare] != 0) break;

      rayEndX += rayDirectionX * MAP_SCALE;
    }

    // temp targets
    let tempX = rayEndX,
      tempY = rayEndY;

    // draw ray
    // context.strokeStyle = "#0f0";
    // context.lineWidth = 1;
    // context.beginPath();
    // context.moveTo(playerMapX, playerMapY);
    // context.lineTo(rayEndX + mapOffsetX, rayEndY + mapOffsetY);
    // context.stroke();

    // horizontal intersection
    let rayDirectionY, horizontalDepth;

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
      if (MAP[targetSquare] != 0) break;

      rayEndY += rayDirectionY * MAP_SCALE;
    }

    // draw ray
    // context.strokeStyle = "#f0f";
    // context.lineWidth = 1;
    // context.beginPath();
    // context.moveTo(playerMapX, playerMapY);
    // context.lineTo(rayEndX + mapOffsetX, rayEndY + mapOffsetY);
    // context.stroke();

    let endX = verticalDepth < horizontalDepth ? tempX : rayEndX;
    let endY = verticalDepth < horizontalDepth ? tempY : rayEndY;

    context.strokeStyle = "#ff0";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(playerMapX, playerMapY);
    context.lineTo(endX + mapOffsetX, endY + mapOffsetY);
    context.stroke();

    currentAngle -= STEP_ANGLE;
  }

  setTimeout(gameLoop, cycleDelay);

  context.fillStyle = "#000";
  context.font = "16px Monospace";
  context.fillText("FPS: " + fpsRate, 0, 20);
}

window.addEventListener("load", gameLoop);
