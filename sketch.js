import AudioManager from "./core/AudioManager.js";
import { InputManager } from "./core/InputManager.js";
import { Ship } from "./entities/Ship.js";
import { GravityWell } from "./entities/GravityWell.js";
import { Target } from "./entities/Target.js";
import { Star } from "./entities/Stars.js";

/* =====================================================
   VARIABLES GLOBALES (accesibles desde otros módulos)
===================================================== */
window.LOGICAL_W = 800;
window.LOGICAL_H = 800;
window.gameScale = 1;
window.offsetX = 0;
window.offsetY = 0;

/* =====================================================
   ESTADO
===================================================== */
const STATE_START = 0;
const STATE_PLAY  = 1;

let gameState = STATE_START;

/* =====================================================
   JUEGO
===================================================== */
let ship;
let wells = [];
let target;
let stars = [];

let audioManager;
let input;
let audioUnlocked = false;

/* =====================================================
   p5 LIFECYCLE (IMPORTANTE)
===================================================== */
window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));

  updateGameScale();

  audioManager = new AudioManager();
  input = new InputManager();

  initStars();
  resetLevel();
};

window.draw = function () {
  background(0);

  if (!audioUnlocked) {
    drawTapToStart();
    return;
  }

  push();
  translate(window.offsetX, window.offsetY);
  scale(window.gameScale);

  if (gameState === STATE_START) {
    drawStart();
  } else {
    updatePlay();
    renderPlay();
  }

  pop();
};

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
  updateGameScale();
};

/* =====================================================
   ESCALADO
===================================================== */
function updateGameScale() {
  const sx = width / window.LOGICAL_W;
  const sy = height / window.LOGICAL_H;

  window.gameScale = min(sx, sy);
  window.offsetX = (width  - window.LOGICAL_W * window.gameScale) / 2;
  window.offsetY = (height - window.LOGICAL_H * window.gameScale) / 2;
}

/* =====================================================
   JUEGO
===================================================== */
function updatePlay() {
  if (input.isThrusting()) {
    ship.thrust(input.getDirection());
  }

  ship.update();

  if (target.reached(ship)) {
    resetLevel();
  }
}

function renderPlay() {
  for (const s of stars) {
    s.update();
    s.display();
  }

  target.display();
  for (const w of wells) w.display(ship);
  ship.display();
}

/* =====================================================
   PANTALLAS
===================================================== */
function drawTapToStart() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("SPACE DRIFT", width / 2, height * 0.4);
  textSize(20);
  text("Tap to start", width / 2, height * 0.55);
}

function drawStart() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Tap / Press to play", window.LOGICAL_W / 2, window.LOGICAL_H / 2);
}

/* =====================================================
   NIVEL
===================================================== */
function resetLevel() {
  ship = new Ship(window.LOGICAL_W * 0.15, window.LOGICAL_H * 0.5);
  target = new Target(window.LOGICAL_W * 0.85, window.LOGICAL_H * 0.5, 25);

  wells = [
    new GravityWell(400, 400, 40, 28)
  ];
}

function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) stars.push(new Star());
}

/* =====================================================
   AUDIO UNLOCK
===================================================== */
window.mousePressed = unlockAudio;
window.touchStarted = function () {
  unlockAudio();
  return false;
};

function unlockAudio() {
  if (!audioUnlocked) {
    userStartAudio();
    audioManager.playStart();
    audioUnlocked = true;
    gameState = STATE_START;

    setTimeout(() => window.scrollTo(0, 1), 100);
  }
}
