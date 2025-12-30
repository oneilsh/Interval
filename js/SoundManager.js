/**
 * SoundManager - Audio loading and playback using p5.sound
 * Ported from Processing to p5.js
 * Original copyright Shawn T. O'Neil 2013, CC BY-NC 4.0
 */

class SoundManager {
  constructor() {
    // Map of filename (without extension) to p5.SoundFile objects
    this.sounds = {};
    // Current instrument/temperament name
    this.instrumentName = 'Equal Tempered';
    // Loading state
    this.isLoading = false;
    this.loadProgress = 0;
    this.totalSounds = 0;
    this.loadedSounds = 0;
    // All note names
    this.noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    // All available instruments/temperaments
    this.availableInstruments = [
      'Equal Tempered',
      'Well Tempered', 
      'Carlos Super Just',
      'Pythagorean'
    ];
    // Base path for sound files
    this.basePath = 'assets/sounds/';
    // Callback for load completion
    this.onLoadComplete = null;
    // Callback for load progress
    this.onLoadProgress = null;
  }

  /**
   * Set the base path for sound files
   */
  setBasePath(path) {
    this.basePath = path;
  }

  /**
   * Load all sounds for the current instrument
   * Returns a promise that resolves when all sounds are loaded
   */
  loadSounds(instrumentName) {
    return new Promise((resolve, reject) => {
      this.instrumentName = instrumentName || this.instrumentName;
      this.isLoading = true;
      this.loadedSounds = 0;
      this.totalSounds = this.noteNames.length;
      
      // Stop and clear any existing sounds
      this.stopAllSounds();
      this.sounds = {};
      
      let loadPromises = [];
      
      for (const note of this.noteNames) {
        const filename = `${this.instrumentName}${note}`;
        // URL-encode the filepath (# becomes %23) for HTTP requests
        const filepath = `${this.basePath}${encodeURIComponent(filename)}.mp3`;
        
        const promise = new Promise((res, rej) => {
          const sound = loadSound(
            filepath,
            () => {
              this.loadedSounds++;
              this.loadProgress = this.loadedSounds / this.totalSounds;
              if (this.onLoadProgress) {
                this.onLoadProgress(this.loadProgress, this.loadedSounds, this.totalSounds);
              }
              res(sound);
            },
            (err) => {
              console.warn(`Failed to load: ${filepath}`, err);
              this.loadedSounds++;
              this.loadProgress = this.loadedSounds / this.totalSounds;
              if (this.onLoadProgress) {
                this.onLoadProgress(this.loadProgress, this.loadedSounds, this.totalSounds);
              }
              res(null); // Resolve with null instead of rejecting
            }
          );
          this.sounds[filename] = sound;
        });
        
        loadPromises.push(promise);
      }
      
      Promise.all(loadPromises).then(() => {
        this.isLoading = false;
        if (this.onLoadComplete) {
          this.onLoadComplete();
        }
        resolve();
      }).catch(reject);
    });
  }

  /**
   * Update instrument name and reload sounds
   */
  async updateInstrumentName(newName) {
    if (newName !== this.instrumentName) {
      await this.loadSounds(newName);
    }
  }

  /**
   * Play a sound by base name (instrument name + note)
   */
  playSound(basename) {
    const sound = this.sounds[basename];
    if (sound && sound.isLoaded()) {
      // If already playing, restart from beginning
      if (sound.isPlaying()) {
        sound.stop();
      }
      sound.play();
    }
  }

  /**
   * Stop a sound by base name
   */
  stopSound(basename) {
    const sound = this.sounds[basename];
    if (sound && sound.isPlaying()) {
      // Fade out quickly for smooth stop
      sound.setVolume(0, 0.1);
      setTimeout(() => {
        sound.stop();
        sound.setVolume(1);
      }, 100);
    }
  }

  /**
   * Stop all currently playing sounds
   */
  stopAllSounds() {
    for (const key of Object.keys(this.sounds)) {
      const sound = this.sounds[key];
      if (sound && sound.isPlaying()) {
        sound.stop();
      }
    }
  }

  /**
   * Get a sound object by base name
   */
  getSound(basename) {
    return this.sounds[basename];
  }

  /**
   * Check if a sound is currently playing
   */
  isSoundPlaying(basename) {
    const sound = this.sounds[basename];
    return sound && sound.isPlaying();
  }

  /**
   * Get current instrument name
   */
  getInstrumentName() {
    return this.instrumentName;
  }

  /**
   * Get loading status
   */
  getLoadingStatus() {
    return {
      isLoading: this.isLoading,
      progress: this.loadProgress,
      loaded: this.loadedSounds,
      total: this.totalSounds
    };
  }
}

