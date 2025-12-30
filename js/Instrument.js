/**
 * Instrument - Wrapper class for instrument/temperament sound playback
 * Ported from Processing to p5.js
 * Original copyright Shawn T. O'Neil 2013, CC BY-NC 4.0
 */

class Instrument {
  /**
   * Create an instrument
   * @param {string} name - Instrument/temperament name (e.g., "Equal Tempered")
   * @param {SoundManager} soundManager - Sound manager instance
   * @param {IntervalMaker} intervalMaker - Interval maker instance
   */
  constructor(name, soundManager, intervalMaker) {
    this.name = name;
    this.soundManager = soundManager;
    this.intervalMaker = intervalMaker;
    
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

