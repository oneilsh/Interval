/**
 * Instrument - Wrapper class for instrument/temperament sound playback
 * Ported from Processing to p5.js
 * Original copyright Shawn T. O'Neil 2013, LGPL
 */

class Instrument {
  /**
   * Create an instrument
   * @param {string} name - Instrument/temperament name (e.g., "Equal Tempered")
   * @param {SoundManager} soundManager - Sound manager instance
   * @param {MusicMaker} musicMaker - Music maker instance
   */
  constructor(name, soundManager, musicMaker) {
    this.name = name;
    this.soundManager = soundManager;
    this.musicMaker = musicMaker;
    
    // Update sound manager to use this instrument
    this.soundManager.instrumentName = name;
  }

  /**
   * Play a note by name (e.g., "C", "F#")
   */
  playNote(noteName) {
    const filebase = this.name + noteName;
    this.soundManager.playSound(filebase);
  }

  /**
   * Stop a note by name
   */
  stopNote(noteName) {
    const filebase = this.name + noteName;
    this.soundManager.stopSound(filebase);
  }

  /**
   * Get the audio object for a note
   */
  getNoteAudio(noteName) {
    const filebase = this.name + noteName;
    return this.soundManager.getSound(filebase);
  }

  /**
   * Get the instrument name
   */
  getName() {
    return this.name;
  }

  /**
   * Update the instrument to a new name/temperament
   * Returns a promise that resolves when sounds are loaded
   */
  async setInstrument(newName) {
    this.name = newName;
    await this.soundManager.updateInstrumentName(newName);
  }
}

