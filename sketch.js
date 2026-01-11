import AudioManager from "./core/AudioManager.js";
// Nota: estás importando InputManager pero no lo usas aún.
// Si lo quieres usar luego, perfecto. Si no, puedes quitarlo.
// import InputManager from "./core/InputManager.js";

import { Ship } from "./entities/Ship.js";
import { GravityWell } from "./entities/GravityWell.js";
import { Target } from "./entities/Target.js";
import { Star } from "./entities/Stars.js";

import { HUD } from "./ui/HUD.js";
import { Streak } from "./ui/Streak.js";

import { Nebula } from "./visuals/Nebula.js";

/*
Space Drift
Juego de navegación basado en fuerzas gravitatorias.
Adaptación completa a p5.js (desktop + móvil).
*/

// ======================================================
// CONFIGURACIÓN GENERAL
// ======================================================
let baseW = 800;
let baseH = 800;

let minPlanets = 2;
let maxPlanets = 3;

// ======================================================
// ESTADOS DEL JUEGO
// ======================================================
const STATE_START = 0;
const STATE_PLAY = 1;
const STATE_WIN = 2;
const STATE_FAIL = 3;
const STATE_PAUSE = 4;
const STATE_SCORES = 5;
const STATE_ENTER_NAME = 6;

let gameState = STATE_START;

// ======================================================
// CONTROL DE TIEMPOS (millis)
// ======================================================
const WIN_DELAY_MS = 1500;
const FAIL_DELAY_MS = 2500;

let winStartTime = 0;
let failStartTime = 0;

// ======================================================
// AUDIO (WEB)
// ======================================================
let audioManager = null;
let audioUnlocked = false;

// ======================================================
// OBJETOS DE JUEGO
// ======================================================
let ship;
let wells = [];
let target;
let hud;

// ======================================================
// PUNTUACIÓN
// ======================================================
let score = 0;
let corrections = 0;

let levelStartScore = 100;
let levelScore = 100;
let penaltyPerCorrection = 2;

// ======================================================
// INPUT
// ======================================================
let isThrusting = false;
let wasThrusting = false;

// ======================================================
// FONDO
// ======================================================
let backgroundLayer;
let stars = [];
let numStars = 250;

// ======================================================
// UI / DECORACIÓN
// ======================================================
let streaks = [];
let numStreaks = 6;

// ======================================================
// PRELOAD (IMPORTANTE PARA loadSound)
// ======================================================
function preload() {
  // Carga de audio aquí para que p5.sound lo gestione correctamente
  audioManager = new AudioManager();
}

// ======================================================
// SETUP
// ======================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));

  hud = new HUD();

  generateBackground();
  initStars();
  initStreaks();
  resetLevel();
}

// ======================================================
// LOOP PRINCIPAL
// ======================================================
function draw() {
  background(0);

  // Overlay obligatorio para desbloquear audio (web/móvil)
  if (!audioUnlocked) {
    drawTapToStartOverlay();
    return;
  }

  // audioManager existe desde preload(); si por cualquier razón no existiera, evitamos crash
  if (audioManager) audioManager.update();

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

    case STATE_PAUSE:
      renderPlay();
      drawPauseOverlay();
      break;

    // Si luego reactivas estas pantallas, añade sus funciones:
    // case STATE_SCORES:
    // case STATE_ENTER_NAME:
  }
}

// ======================================================
// JUEGO
// ======================================================
function updatePlay() {
  levelScore = max(0, levelStartScore - corrections * penaltyPerCorrection);

  for (let w of wells) {
    ship.applyForce(w.attract(ship));
    if (w.collides(ship)) {
      failStartTime = millis();
      audioManager.playFail(true);
      gameState = STATE_FAIL;
      return;
    }
  }

  handleInput();
  ship.update();

  if (ship.outOfBounds(width, height)) {
    failStartTime = millis();
    audioManager.playFail(false);
    gameState = STATE_FAIL;
    return;
  }

  if (target.reached(ship)) {
    winStartTime = millis();
    audioManager.playWin();
    gameState = STATE_WIN;
  }
}

function renderPlay() {
  image(backgroundLayer, 0, 0, width, height);

  blendMode(ADD);
  colorMode(HSB, 360, 100, 100, 255);
  for (let s of stars) {
    s.update();
    s.display();
  }
  colorMode(RGB);
  blendMode(BLEND);

  target.display();
  for (let w of wells) w.display(ship);
  ship.display(isThrusting);

  hud.display(score, levelScore, corrections);
}

// ======================================================
// PANTALLAS
// ======================================================
function drawStart() {
  image(backgroundLayer, 0, 0, width, height);

  for (let s of streaks) {
    s.update();
    s.display();
  }

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.08);
  text("SPACE DRIFT", width / 2, height * 0.3);

  textSize(min(width, height) * 0.035);
  text(
    "Tap or press to start\nUse arrows or touch thrust\nAvoid gravity wells",
    width / 2,
    height * 0.55
  );
}

function drawWin() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Stable trajectory", width / 2, 30);

  if (millis() - winStartTime > WIN_DELAY_MS) {
    score += levelScore;
    resetForNext();
    gameState = STATE_PLAY;
  }
}

function drawFail() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Lost contact", width / 2, 30);

  if (millis() - failStartTime > FAIL_DELAY_MS) {
    audioManager.updateThrust(false);
    audioManager.stopFailFX();
    audioManager.fadeToStart();
    resetGame();
    gameState = STATE_START;
  }
}

// ======================================================
// PAUSA (si la necesitas)
// ======================================================
function drawPauseOverlay() {
  push();
  fill(0, 180);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("PAUSED", width / 2, height / 2 - 20);
  textSize(16);
  text("Tap / press SPACE to resume", width / 2, height / 2 + 20);
  pop();
}

// ======================================================
// INPUT
// ======================================================
function handleInput() {
  isThrusting = false;

  if (keyIsDown(LEFT_ARROW))  { ship.thrust(createVector(-1, 0)); isThrusting = true; }
  if (keyIsDown(RIGHT_ARROW)) { ship.thrust(createVector(1, 0));  isThrusting = true; }
  if (keyIsDown(UP_ARROW))    { ship.thrust(createVector(0, -1)); isThrusting = true; }
  if (keyIsDown(DOWN_ARROW))  { ship.thrust(createVector(0, 1));  isThrusting = true; }

  if (isThrusting && !wasThrusting) corrections++;

  audioManager.updateThrust(isThrusting);
  wasThrusting = isThrusting;
}

// ======================================================
// RESET
// ======================================================
function resetForNext() {
  corrections = 0;
  wasThrusting = false;
  levelScore = levelStartScore;

  generateBackground();
  resetLevel();
}

function resetGame() {
  score = 0;
  resetForNext();
}

// ======================================================
// NIVEL / FONDO
// ======================================================
function resetLevel() {
  ship = new Ship(width * 0.15, height * 0.5);

  target = new Target(
    width * 0.85,
    random(80, height - 80),
    min(width, height) * 0.035
  );

  wells = [];
  let num = floor(random(minPlanets, maxPlanets + 1));

  for (let i = 0; i < num; i++) {
    wells.push(
      new GravityWell(
        random(width * 0.25, width * 0.75),
        random(height * 0.25, height * 0.75),
        random(25, 50),
        random(20, 32)
      )
    );
  }
}

function generateBackground() {

  const d = pixelDensity();

  backgroundLayer = createGraphics(width * d, height * d);
  backgroundLayer.pixelDensity(1); // MUY IMPORTANTE

  let nebula = new Nebula();
  nebula.render(backgroundLayer);
}


function initStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) stars.push(new Star());
}

function initStreaks() {
  streaks = [];
  for (let i = 0; i < numStreaks; i++) streaks.push(new Streak());
}

// ======================================================
// OVERLAY TAP TO START
// ======================================================
function drawTapToStartOverlay() {
  push();
  fill(0, 220);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.09);
  text("SPACE DRIFT", width / 2, height * 0.4);

  textSize(min(width, height) * 0.04);
  text("Tap to start", width / 2, height * 0.55);

  pop();
}

// ======================================================
// DESBLOQUEO AUDIO (WEB)
// ======================================================
function unlockAudioIfNeeded() {
  if (!audioUnlocked) {
    userStartAudio();
    audioManager.playStart();
    audioUnlocked = true;
    gameState = STATE_START;
  }
}

function mousePressed() {

  // 1. Desbloqueo de audio (solo la primera vez)
  if (!audioUnlocked) {
    unlockAudioIfNeeded();
    return;
  }

  // 2. Arranque del juego desde la pantalla inicial
  if (gameState === STATE_START) {
    audioManager.fadeToGame();
    resetGame();
    gameState = STATE_PLAY;
  }
}


function touchStarted() {

  if (!audioUnlocked) {
    unlockAudioIfNeeded();
    return false;
  }

  if (gameState === STATE_START) {
    audioManager.fadeToGame();
    resetGame();
    gameState = STATE_PLAY;
  }

  return false;
}


// ======================================================
// RESPONSIVE
// ======================================================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateBackground();
  initStars();
  initStreaks();
  resetLevel();
}

// ======================================================
// REGISTRO EN window PARA QUE p5 (GLOBAL MODE) LOS ENCUENTRE
// ======================================================
window.preload = preload;
window.setup = setup;
window.draw = draw;

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;

window.windowResized = windowResized;
