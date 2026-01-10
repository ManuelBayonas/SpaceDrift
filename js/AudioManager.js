class AudioManager {

  constructor() {
    this.startTheme = loadSound('assets/audio/Start_theme.mp3');
    this.bgTheme    = loadSound('assets/audio/Background_theme.mp3');
    this.thrust     = loadSound('assets/audio/Thrust_sound.wav');
    this.win        = loadSound('assets/audio/Target_reached.wav');
    this.fail1      = loadSound('assets/audio/Collision_lost.wav');
    this.fail2      = loadSound('assets/audio/Off_screen_lost.wav');

    this.musicFade = 1;
    this.fadeSpeed = 0.02;
    this.fadingToGame = false;
    this.fadingToStart = false;
  }

  playStart() {
    this.startTheme.loop();
  }

  fadeToGame() {
    this.fadingToGame = true;
    if (!this.bgTheme.isPlaying()) this.bgTheme.loop();
  }

  update() {
    if (this.fadingToGame) {
      this.musicFade = max(this.musicFade - this.fadeSpeed, 0);
      this.startTheme.setVolume(this.musicFade);
      this.bgTheme.setVolume(1 - this.musicFade);
      if (this.musicFade === 0) this.startTheme.stop();
    }
  }

  updateThrust(on) {
    if (on && !this.thrust.isPlaying()) this.thrust.loop();
    if (!on && this.thrust.isPlaying()) this.thrust.stop();
  }

  playWin() { this.win.play(); }
  playFail(collision) { (collision ? this.fail1 : this.fail2).play(); }
}
