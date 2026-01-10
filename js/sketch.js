// ==============================
// CONFIGURACIÓN GLOBAL
// ==============================
const LOGICAL_SIZE = 800;

let scaleFactor = 1;
let offsetX = 0;
let offsetY = 0;

// Estados
const STATE_START = 0;
const STATE_PLAY  = 1;
const STATE_WIN   = 2;
const STATE_FAIL  = 3;

let gameState = STATE_START;

// Tiempos
const WIN_DELAY_MS  = 1500;
const FAIL_DELAY_MS = 2500;
let winStartTime = 0;
let failStartTime = 0;

// Juego
let ship, target, wells, hud;
let stars = [];
let streaks = [];
let backgroundLayer;

// Puntuación
let score = 0;
let corrections = 0;
let levelScore = 100;

// Input
let isThrusting = false;
let wasThrusting = false;

// Audio
let audio;
let audioUnlocked = false;

// Fuentes
let titleFont, uiFont;

// ==============================
// SETUP
// ==============================
function preload() {
  titleFont = loadFont('assets/fonts/Inter_BoldItalic.ttf');
  uiFont    = loadFont('assets/fonts/Inter_Medium.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  calculateViewport();

  audio = new AudioManager();
  hud = new HUD();

  initStars();
  initStreaks();
  generateBackground();
  resetLevel();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateViewport();
}

function calculateViewport() {
  scaleFactor = min(width / LOGICAL_SIZE, height / LOGICAL_SIZE);
  offsetX = (width  - LOGICAL_SIZE * scaleFactor) / 2;
  offsetY = (height - LOGICAL_SIZE * scaleFactor) / 2;
}

// ==============================
// DRAW
// ==============================
function draw() {
  background(0);
  if (audioUnlocked) audio.update();

  push();
  translate(offsetX, offsetY);
  scale(scaleFactor);

  switch (gameState) {
    case STATE_START:
      drawStart();
      break;

    case STATE_PLAY:
      updatePlay();
      renderPlay();
      break;

    case STATE_WIN:
      renderPlay();
      drawWin();
      break;

    case STATE_FAIL:
      renderPlay();
      drawFail();
      break;
  }

  pop();
}
