export default class AudioManager {

  constructor() {

    // --------------------
    // MÚSICA / AMBIENTE
    // --------------------
    this.startTheme = loadSound("assets/audio/Start_theme.mp3");
    this.menuNoise  = loadSound("assets/audio/Communications_noise.wav");
    this.gameTheme  = loadSound("assets/audio/Background_theme.mp3");

    // --------------------
    // EFECTOS
    // --------------------
    this.targetReached = loadSound("assets/audio/Target_reached.wav");
    this.thrustSound   = loadSound("assets/audio/Thrust_sound.wav");
    this.collisionLost = loadSound("assets/audio/Collision_lost.wav");
    this.offscreenLost = loadSound("assets/audio/Off_screen_lost.wav");

    // --------------------
    // ESTADO INTERNO
    // --------------------
    this.thrustPlaying = false;

    this.musicFade = 1.0;
    this.fadeSpeed = 0.02;
    this.fadingToGame  = false;
    this.fadingToStart = false;
  }

  // ======================================================
  // INICIO / MENÚ
  // ======================================================
  playStart() {
    this.stopAll();

    this.musicFade = 1.0;

    this.startTheme.setVolume(1.0);
    this.menuNoise.setVolume(0.6);
    this.gameTheme.setVolume(0.0);

    this.startTheme.loop();
    this.menuNoise.loop();
  }

  // ======================================================
  // TRANSICIÓN A JUEGO
  // ======================================================
  fadeToGame() {
    this.fadingToGame  = true;
    this.fadingToStart = false;

    if (!this.gameTheme.isPlaying()) {
      this.gameTheme.loop();
    }
  }

  // ======================================================
  // TRANSICIÓN A MENÚ
  // ======================================================
  fadeToStart() {
    this.fadingToStart = true;
    this.fadingToGame  = false;

    if (!this.startTheme.isPlaying()) {
      this.startTheme.loop();
    }
    if (!this.menuNoise.isPlaying()) {
      this.menuNoise.loop();
    }
  }

  // ======================================================
  // EFECTOS DE JUEGO
  // ======================================================
  playWin() {
    if (this.targetReached.isLoaded()) {
      this.targetReached.play();
    }
  }

  playFail(collision = true) {
    if (collision) {
      this.collisionLost.play();
    } else {
      this.offscreenLost.play();
    }
  }

  // ======================================================
  // THRUST (LOOP CONTROLADO)
  // ======================================================
  updateThrust(isThrusting) {

    if (isThrusting && !this.thrustPlaying) {
      this.thrustSound.loop();
      this.thrustPlaying = true;
    }

    if (!isThrusting && this.thrustPlaying) {
      this.thrustSound.stop();
      this.thrustPlaying = false;
    }
  }

  // ======================================================
  // ACTUALIZACIÓN POR FRAME
  // ======================================================
  update() {
    this.updateFades();
  }

  updateFades() {

    if (this.fadingToGame) {
      this.musicFade = max(this.musicFade - this.fadeSpeed, 0);

      this.startTheme.setVolume(this.musicFade);
      this.menuNoise.setVolume(this.musicFade * 0.6);
      this.gameTheme.setVolume(1.0 - this.musicFade);

      if (this.musicFade === 0) {
        this.startTheme.stop();
        this.menuNoise.stop();
        this.fadingToGame = false;
      }
    }

    if (this.fadingToStart) {
      this.musicFade = min(this.musicFade + this.fadeSpeed, 1);

      this.startTheme.setVolume(this.musicFade);
      this.menuNoise.setVolume(this.musicFade * 0.6);
      this.gameTheme.setVolume(1.0 - this.musicFade);

      if (this.musicFade === 1) {
        this.gameTheme.stop();
        this.fadingToStart = false;
      }
    }
  }

  // ======================================================
  // PARADAS
  // ======================================================
  stopFailFX() {
    this.collisionLost.stop();
    this.offscreenLost.stop();
  }

  stopAll() {
    this.startTheme.stop();
    this.menuNoise.stop();
    this.gameTheme.stop();

    this.thrustSound.stop();
    this.collisionLost.stop();
    this.offscreenLost.stop();
    this.targetReached.stop();

    this.thrustPlaying = false;
    this.fadingToGame  = false;
    this.fadingToStart = false;
  }
}
