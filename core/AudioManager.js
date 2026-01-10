export class AudioManager {

  constructor() {
    this.startTheme = loadSound("assets/audio/Start_theme.mp3");
    this.backgroundTheme = loadSound("assets/audio/Background_theme.mp3");
    this.winFX = loadSound("assets/audio/Target_reached.wav");
    this.failFX = loadSound("assets/audio/Off_screen_lost.wav");

    this.fade = 1;
    this.fadeSpeed = 0.02;
    this.fadingToGame = false;
    this.fadingToStart = false;
  }

  playStart() {
    this.stopAll();
    this.startTheme.setVolume(1);
    this.startTheme.loop();
  }

  fadeToGame() {
    this.fadingToGame = true;
    this.fadingToStart = false;
    if (!this.backgroundTheme.isPlaying()) {
      this.backgroundTheme.loop();
      this.backgroundTheme.setVolume(0);
    }
  }

  fadeToStart() {
    this.fadingToStart = true;
    this.fadingToGame = false;
    if (!this.startTheme.isPlaying()) {
      this.startTheme.loop();
    }
  }

  playWin() {
    this.winFX.play();
  }

  playFail() {
    this.failFX.play();
  }

  update() {
    if (this.fadingToGame) {
      this.fade = max(this.fade - this.fadeSpeed, 0);
      this.startTheme.setVolume(this.fade);
      this.backgroundTheme.setVolume(1 - this.fade);
      if (this.fade === 0) {
        this.startTheme.stop();
        this.fadingToGame = false;
      }
    }

    if (this.fadingToStart) {
      this.fade = min(this.fade + this.fadeSpeed, 1);
      this.startTheme.setVolume(this.fade);
      this.backgroundTheme.setVolume(1 - this.fade);
      if (this.fade === 1) {
        this.backgroundTheme.stop();
        this.fadingToStart = false;
      }
    }
  }

  stopAll() {
    this.startTheme?.stop();
    this.backgroundTheme?.stop();
  }
}
