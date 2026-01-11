import AudioManager from "./core/AudioManager.js";
import { InputManager } from "./core/InputManager.js";

import { Ship } from "./entities/Ship.js";
import { GravityWell } from "./entities/GravityWell.js";
import { Target } from "./entities/Target.js";
import { Star } from "./entities/Stars.js";

// ======================================================
// CONFIGURACIÓN LÓGICA
// ======================================================
export const LOGICAL_W = 800;
export const LOGICAL_H = 800;

export let gameScale = 1;
export let offsetX = 0;
export let offsetY = 0;

// ======================================================
// ESTADOS
// ======================================================
const STATE_START = 0;
const STATE_PLAY  = 1;
const STATE_WIN   = 2;
const STATE_FAIL  = 3;

let gameState = STATE_START;

// ======================================================
// JUEGO
// ======================================================
let ship;
let wells = [];
let target;
let stars = [];

let score = 0;
let corrections = 0;
const levelStartScore = 100;

// ======================================================
// AUDIO
// ======================================================
let audioManager;
let audioUnlocked = false;

// ======================================================
// INPUT
// ======================================================
let input;

// ======================================================
// SETUP
// ======================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));

  updateGameScale();

  audioManager = new AudioManager();
  input = new InputManager();

  generateStars();
  resetLevel();
}

// ======================================================
// DRAW
// ======================================================
function draw() {
  background(0);

  if (!audioUnlocked) {
    drawTapToStart();
    return;
  }

  audioManager.update();

  push();
  translate(offsetX, offsetY);
  scale(gameScale);

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

// ======================================================
// ESCALADO RESPONSIVE
// ======================================================
function updateGameScale() {
  const sx = width / LOGICAL_W;
  const sy = height / LOGICAL_H;

  gameScale = min(sx, sy);
  offsetX = (width  - LOGICAL_W * gameScale) / 2;
  offsetY = (height - LOGICAL_H * gameScale) / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateGameScale();
}

// ======================================================
// JUEGO
// ======================================================
function updatePlay() {
  for (const w of wells) {
    ship.applyForce(w.attract(ship));
    if (w.collides(ship)) {
      audioManager.playFail(true);
      gameState = STATE_FAIL;
      return;
    }
  }

  if (input.isThrusting()) {
    ship.thrust(input.getDirection());
    corrections++;
    audioManager.updateThrust(true);
  } else {
    audioManager.updateThrust(false);
  }

  ship.update();

  if (ship.outOfBounds(LOGICAL_W, LOGICAL_H)) {
    audioManager.playFail(false);
    gameState = STATE_FAIL;
  }

  if (target.reached(ship)) {
    audioManager.playWin();
    score += max(0, levelStartScore - corrections);
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

// ======================================================
// PANTALLAS
// ======================================================
function drawTapToStart() {
  fill(0, 220);
  rect(0, 0, width, height);

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
  textSize(42);
  text("SPACE DRIFT", LOGICAL_W / 2, LOGICAL_H / 3);

  textSize(18);
  text("Avoid gravity wells\nReach the target",
       LOGICAL_W / 2, LOGICAL_H / 2);
}

function drawWin() {
  fill(255);
  textAlign(CENTER, CENTER);
  text("Stable trajectory", LOGICAL_W / 2, 30);
}

function drawFail() {
  fill(255);
  textAlign(CENTER, CENTER);
  text("Lost contact", LOGICAL_W / 2, 30);
}

// ======================================================
// NIVEL
// ======================================================
function resetLevel() {
  corrections = 0;

  ship = new Ship(LOGICAL_W * 0.15, LOGICAL_H * 0.5);
  target = new Target(LOGICAL_W * 0.85, random(80, LOGICAL_H - 80), 25);

  wells = [];
  const n = floor(random(2, 4));
  for (let i = 0; i < n; i++) {
    wells.push(
      new GravityWell(
        random(LOGICAL_W * 0.3, LOGICAL_W * 0.7),
        random(LOGICAL_H * 0.3, LOGICAL_H * 0.7),
        random(25, 50),
        random(20, 32)
      )
    );
  }
}

function generateStars() {
  stars = [];
  for (let i = 0; i < 250; i++) stars.push(new Star());
}

// ======================================================
// AUDIO UNLOCK
// ======================================================
function unlockAudio() {
  if (!audioUnlocked) {
    userStartAudio();
    audioManager.playStart();
    audioUnlocked = true;
    gameState = STATE_START;

    setTimeout(() => window.scrollTo(0, 1), 100);
  }
}

function mousePressed() { unlockAudio(); }
function touchStarted() { unlockAudio(); return false; }
