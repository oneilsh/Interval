/**
 * SequencePlayer - Plays sequences of chords with configuration
 * 
 * A sequence is a JSON object with optional configuration and events:
 * {
 *   config: { temperament, root, scale, fifths, chromaticColors },
 *   events: [
 *     { notes: ["C", "E", "G"], duration: 1000, sustain: 800 },
 *     ...
 *   ]
 * }
 */

class SequencePlayer {
  /**
   * Create a sequence player
   * @param {MusicMaker} musicMaker - Music theory engine
   * @param {Instrument} instrument - Sound playback
   * @param {ScaleVisualizer} scaleVisualizer - Visual display
   * @param {Object} uiRefs - References to UI elements for syncing
   */
  constructor(musicMaker, instrument, scaleVisualizer, uiRefs = {}) {
    this.musicMaker = musicMaker;
    this.instrument = instrument;
    this.scaleVisualizer = scaleVisualizer;
    this.uiRefs = uiRefs;
    
    this.isPlaying = false;
    this.currentSequence = null;
    this.eventIndex = 0;
    this.timeoutId = null;
    
    // Store original config for restoration
    this.originalConfig = null;
  }
  
  /**
   * Set UI references for syncing dropdowns/checkboxes
   */
  setUIRefs(refs) {
    this.uiRefs = refs;
  }
  
  /**
   * Parse a compact string notation into a sequence object
   * 
   * Formats supported:
   * - Simple: "Pythagorean|G#+D#|2000" (temperament|notes|duration)
   * - With root/scale: "Well Tempered,C,Major|C+E+G|1500"
   * - Multiple events: "Equal Tempered|C+E+G|1000;E+G+B|1000"
   * - Config only: "Pythagorean,G#,Major|" (just configure, no playback)
   * 
   * @param {string} str - Compact notation string
   * @returns {Object} Sequence object
   */
  static fromCompact(str) {
    const sequence = { config: {}, events: [] };
    
    // Split by | to get config, events parts
    const parts = str.split('|');
    
    if (parts.length < 1) {
      return sequence;
    }
    
    // First part is config: "Temperament" or "Temperament,Root,Scale" or with display
    const configPart = parts[0].trim();
    if (configPart) {
      const configItems = configPart.split(',').map(s => s.trim());
      
      // First item is always temperament if present
      if (configItems[0]) {
        sequence.config.temperament = configItems[0];
      }
      
      // Second is root note
      if (configItems[1]) {
        sequence.config.root = configItems[1];
      }
      
      // Third is scale
      if (configItems[2]) {
        sequence.config.scale = configItems[2];
      }
      
      // Fourth could be fifths (true/false)
      if (configItems[3] !== undefined) {
        sequence.config.fifths = configItems[3] === 'true';
      }
      
      // Fifth could be chromaticColors
      if (configItems[4] !== undefined) {
        sequence.config.chromaticColors = configItems[4] === 'true';
      }
    }
    
    // Second part is events (notes): "C+E+G" or "C+E+G;E+G+B" for multiple
    if (parts.length >= 2 && parts[1].trim()) {
      const eventsPart = parts[1].trim();
      const eventStrings = eventsPart.split(';');
      
      for (let i = 0; i < eventStrings.length; i++) {
        const eventStr = eventStrings[i].trim();
        if (!eventStr) continue;
        
        const notes = eventStr.split('+').map(n => n.trim()).filter(n => n);
        
        // Duration comes from parts[2] if single event, or default
        let duration = 1500;
        let sustain = null;
        
        if (parts.length >= 3 && parts[2].trim()) {
          const timingParts = parts[2].trim().split(',');
          duration = parseInt(timingParts[0]) || 1500;
          if (timingParts[1]) {
            sustain = parseInt(timingParts[1]);
          }
        }
        
        const event = { notes, duration };
        if (sustain !== null) {
          event.sustain = sustain;
        }
        
        sequence.events.push(event);
      }
    }
    
    return sequence;
  }
  
  /**
   * Parse URL query parameters into a sequence
   * @param {string} queryString - URL query string (with or without leading ?)
   * @returns {Object|null} Sequence object or null if no demo param
   */
  static fromURL(queryString) {
    const params = new URLSearchParams(queryString.replace(/^\?/, ''));
    const demo = params.get('demo');
    
    if (!demo) {
      return null;
    }
    
    return SequencePlayer.fromCompact(decodeURIComponent(demo));
  }
  
  /**
   * Store current configuration for later restoration
   */
  saveCurrentConfig() {
    this.originalConfig = {
      temperament: this.instrument.getName(),
      root: this.musicMaker.getCurrentRoot(),
      scale: this.musicMaker.getCurrentScaleType(),
      fifths: this.scaleVisualizer.fifthsView,
      chromaticColors: this.scaleVisualizer.chromaticColors
    };
  }
  
  /**
   * Restore original configuration
   */
  async restoreConfig() {
    if (!this.originalConfig) return;
    
    await this.applyConfig(this.originalConfig);
    this.originalConfig = null;
  }
  
  /**
   * Apply configuration changes
   * @param {Object} config - Configuration object
   */
  async applyConfig(config) {
    if (!config) return;
    
    // Apply temperament change (async - loads sounds)
    if (config.temperament && config.temperament !== this.instrument.getName()) {
      await this.instrument.setInstrument(config.temperament);
      
      // Update UI dropdown
      if (this.uiRefs.instrumentSelect) {
        this.uiRefs.instrumentSelect.value = config.temperament;
      }
    }
    
    // Apply root and scale
    const root = config.root || this.musicMaker.getCurrentRoot();
    const scale = config.scale || this.musicMaker.getCurrentScaleType();
    
    if (root !== this.musicMaker.getCurrentRoot() || 
        scale !== this.musicMaker.getCurrentScaleType()) {
      this.musicMaker.setScale(root, scale);
      
      // Update UI dropdowns
      if (this.uiRefs.noteSelect) {
        this.uiRefs.noteSelect.value = root;
      }
      if (this.uiRefs.scaleSelect) {
        this.uiRefs.scaleSelect.value = scale;
      }
    }
    
    // Apply display settings
    if (config.fifths !== undefined) {
      this.scaleVisualizer.setFifthsView(config.fifths);
      if (this.uiRefs.fifthsCheckbox) {
        this.uiRefs.fifthsCheckbox.checked = config.fifths;
      }
    }
    
    if (config.chromaticColors !== undefined) {
      this.scaleVisualizer.setChromaticColors(config.chromaticColors);
      if (this.uiRefs.chromaticColorsCheckbox) {
        this.uiRefs.chromaticColorsCheckbox.checked = config.chromaticColors;
      }
    }
  }
  
  /**
   * Resolve note specifications to actual note names
   * Notes can be:
   * - Absolute names: "C", "F#"
   * - Scale degrees (numbers): 1, 3, 5
   * - Semitone offsets (with 's' prefix): "s0", "s4", "s7"
   * 
   * @param {Array} notes - Array of note specifications
   * @returns {Array} Array of note names
   */
  resolveNotes(notes) {
    return notes.map(note => {
      // Already a note name
      if (typeof note === 'string' && /^[A-G]#?$/.test(note)) {
        return note;
      }
      
      // Scale degree (number)
      if (typeof note === 'number') {
        return this.musicMaker.getNoteForScaleDegree(note);
      }
      
      // Scale degree as string
      if (typeof note === 'string' && /^\d+$/.test(note)) {
        return this.musicMaker.getNoteForScaleDegree(parseInt(note));
      }
      
      // Semitone offset (e.g., "s4" for major third)
      if (typeof note === 'string' && /^s\d+$/.test(note)) {
        const offset = parseInt(note.substring(1));
        const rootNum = this.musicMaker.notesToNumbers[this.musicMaker.getCurrentRoot()];
        const noteNum = (rootNum + offset) % 12;
        return this.musicMaker.numbersToNotes[noteNum];
      }
      
      // Unknown format, return as-is
      return note;
    });
  }
  
  /**
   * Play a sequence
   * @param {Object|string} sequence - Sequence object or compact string
   * @param {Object} options - Playback options
   * @param {boolean} options.saveConfig - Whether to save and restore config (default: false)
   */
  async play(sequence, options = {}) {
    // Stop any current playback
    this.stop();
    
    // Parse if string
    if (typeof sequence === 'string') {
      sequence = SequencePlayer.fromCompact(sequence);
    }
    
    this.currentSequence = sequence;
    this.eventIndex = 0;
    this.isPlaying = true;
    
    // Optionally save current config
    if (options.saveConfig) {
      this.saveCurrentConfig();
    }
    
    // Apply configuration
    await this.applyConfig(sequence.config);
    
    // If no events, just apply config and return
    if (!sequence.events || sequence.events.length === 0) {
      this.isPlaying = false;
      return;
    }
    
    // Start playing events
    this.playNextEvent();
  }
  
  /**
   * Play the next event in the sequence
   */
  playNextEvent() {
    if (!this.isPlaying || !this.currentSequence) return;
    
    const events = this.currentSequence.events;
    if (this.eventIndex >= events.length) {
      // Sequence complete
      this.isPlaying = false;
      this.currentSequence = null;
      return;
    }
    
    const event = events[this.eventIndex];
    const notes = this.resolveNotes(event.notes);
    const duration = event.duration || 1500;
    const sustain = event.sustain || duration * 0.8;
    
    // Play notes
    for (const note of notes) {
      this.musicMaker.addPlayingNote(note);
      this.instrument.playNote(note);
    }
    
    // Schedule note release (sustain)
    setTimeout(() => {
      for (const note of notes) {
        this.musicMaker.releasePlayingNote(note);
      }
    }, sustain);
    
    // Schedule next event
    this.eventIndex++;
    this.timeoutId = setTimeout(() => {
      this.playNextEvent();
    }, duration);
  }
  
  /**
   * Stop playback and release all notes
   */
  stop() {
    this.isPlaying = false;
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    // Release any playing notes
    const playingNotes = this.musicMaker.getCurrentlyPlayingNotes();
    for (const note of Object.keys(playingNotes)) {
      this.musicMaker.releasePlayingNote(note);
    }
    
    this.currentSequence = null;
    this.eventIndex = 0;
  }
  
  /**
   * Play a single chord (convenience method)
   * @param {Array} notes - Note names or specifications
   * @param {number} duration - How long to display chord (ms)
   * @param {number} sustain - How long to hold notes (ms)
   */
  playChord(notes, duration = 1500, sustain = null) {
    const sequence = {
      events: [{
        notes,
        duration,
        sustain: sustain || duration * 0.8
      }]
    };
    this.play(sequence);
  }
  
  /**
   * Configure and play a chord (convenience method for demos)
   * @param {Object} config - Configuration to apply
   * @param {Array} notes - Notes to play
   * @param {number} duration - Duration in ms
   */
  async demo(config, notes, duration = 2000) {
    const sequence = {
      config,
      events: [{
        notes,
        duration,
        sustain: duration * 0.8
      }]
    };
    await this.play(sequence);
  }
}

