/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const WIDTH = 600,
  HALF_WIDTH = 300;
const HEIGHT = 400,
  HALF_HEIGHT = 200;

// const FPS = 60;
// const cycleDelay = Math.floor(1000 / FPS); // Round down to interger

let lastFrameTime = 0;
let frameCount = 0;
let fpsRate = "...";

// Game Loop
function gameLoop(timeStamp) {
  // calculate FPS
  const delta = timeStamp - lastFrameTime;
  frameCount++;

  // Update every 1 sec
  if (delta >= 1000) {
    fpsRate = Math.floor((frameCount * 1000) / delta); // time is in ms so *1000
    frameCount = 0;
    lastFrameTime = timeStamp;
  }

  // canvas resizing
  canvas.width = window.innerWidth * 1;
  canvas.height = window.innerHeight * 1;

  // Update screen
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "White";
  context.fillRect(
    canvas.width / 2 - HALF_WIDTH,
    canvas.height / 2 - HALF_HEIGHT,
    WIDTH,
    HEIGHT
  );

  context.fillStyle = "White";
  context.font = "16px Monospace";
  context.fillText("FPS: " + fpsRate, 0, 20);

  requestAnimationFrame(gameLoop);
}

window.addEventListener("load", () => {
  gameLoop();
});
