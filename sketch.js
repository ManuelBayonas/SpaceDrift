import { AudioManager } from "./core/AudioManager.js";
import { InputManager } from "./core/InputManager.js";

import { Ship } from "./entities/Ship.js";
import { GravityWell } from "./entities/GravityWell.js";
import { Target } from "./entities/Target.js";
import { Star } from "./entities/Star.js";

import { HUD } from "./ui/HUD.js";
import { Streak } from "./ui/Streak.js";

import { Nebula } from "./visuals/Nebula.js";

/* ----------------------------------
   CONFIGURACIÓN GENERAL
---------------------------------- */
let baseW = 800;
let baseH = 800;

/* ----------------------------------
   ESTADOS
---------------------------------- */
const STATE_START = 0;
const STATE_PLAY  = 1;
const STATE_WIN   = 2;
const STATE_FAIL  = 3;
const STATE_PAUSE = 4;

let gameState = STATE_START;

/* ----------------------------------
   OBJETOS
---------------------------------- */
let ship, target, hud;
let wells = [];
let stars = [];
let streaks = [];

let backgroundLayer;
let audio;
let input;

/* ----------------------------------
   TIEMPOS
---------------------------------- */
const WIN_DELAY = 1500;
const FAIL_DELAY = 2500;
let winTime = 0;
let failTime = 0;

/* ----------------------------------
   PUNTUACIÓN
---------------------------------- */
let score = 0;
let corrections = 0;
const levelStartScore = 100;

/* ----------------------------------
   p5.js
---------------------------------- */
window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));

  audio = new AudioManager();
  input = new InputManager();

  hud = new HUD();
  initGame();

  audio.playStart();
};

window.draw = function () {
  background(0);
  audio.update();

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
      hud.drawPause();
      break;
  }
};

/* ----------------------------------
   JUEGO
---------------------------------- */
function initGame() {
  generateBackground();
  ship = new Ship(width * 0.15, height * 0.5);
  target = new Target(width * 0.85, random(80, height - 80), 25);

  wells = [];
  for (let i = 0; i < int(random(2, 4)); i++) {
    wells.push(
      new GravityWell(
        random(width * 0.3, width * 0.7),
        random(height * 0.3, height * 0.7),
        random(25, 50),
        random(20, 32)
      )
    );
  }

  stars = Array.from({ length: 200 }, () => new Star());
  streaks = Array.from({ length: 6 }, () => new Streak());
}

function updatePlay() {
  input.update();

  wells.forEach(w => ship.applyForce(w.attract(ship)));

  if (input.isThrusting()) {
    ship.thrust(input.getDirection());
    corrections++;
  }

  ship.update();

  if (ship.outOfBounds(width, height)) {
    failTime = millis();
    audio.playFail(false);
    gameState = STATE_FAIL;
  }

  if (target.reached(ship)) {
    winTime = millis();
    audio.playWin();
    gameState = STATE_WIN;
  }
}

function renderPlay() {
  image(backgroundLayer, 0, 0);

  blendMode(ADD);
  stars.forEach(s => { s.update(); s.display(); });
  blendMode(BLEND);

  wells.forEach(w => w.display(ship));
  target.display();
  ship.display();

  const currentScore = max(0, levelStartScore - corrections * 2);
  hud.display(score, currentScore, corrections);
}

function drawStart() {
  image(backgroundLayer, 0, 0);
  stars.forEach(s => { s.update(); s.display(); });
  streaks.forEach(s => { s.update(); s.display(); });

  hud.drawStart();
}

function drawWin() {
  hud.drawMessage("Stable trajectory");
  if (millis() - winTime > WIN_DELAY) {
    score += max(0, levelStartScore - corrections * 2);
    corrections = 0;
    initGame();
    gameState = STATE_PLAY;
  }
}

function drawFail() {
  hud.drawMessage("Lost contact");
  if (millis() - failTime > FAIL_DELAY) {
    corrections = 0;
    score = 0;
    audio.fadeToStart();
    gameState = STATE_START;
  }
}

/* ----------------------------------
   UTILIDADES
---------------------------------- */
function generateBackground() {
  backgroundLayer = createGraphics(width, height);
  new Nebula().render(backgroundLayer);
}

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
  generateBackground();
};
