/**
 * ScaleVisualizer - Main wheel visualization for notes, scales, and chords
 * Ported from Processing to p5.js
 * Original copyright Shawn T. O'Neil 2013, LGPL
 */

class ScaleVisualizer {
  /**
   * Create the scale visualizer
   * @param {MusicMaker} musicMaker - Music maker instance
   * @param {Instrument} currentInstrument - Current instrument
   */
  constructor(musicMaker, currentInstrument) {
    this.musicMaker = musicMaker;
    this.currentInstrument = currentInstrument;
    
    // Display settings
    this.centerX = 0;
    this.centerY = 0;
    this.radius = 0;
    this.noteCircumference = 30;
    this.minAlpha = 30;
    
    // Display mode
    this.byFifths = false;
    
    // Color mode: true = chromatic (by frequency), false = fifths relationship
    this.chromaticColors = false;
    
    // Note colors (using HSB, will convert to values)
    this.noteColors = {};
    // Note alphas (opacity for scale highlighting)
    this.noteAlphas = {};
    // Current note positions on wheel (0-12)
    this.noteLocations = {};
    // Chromatic positions (A=0, A#=1, etc.)
    this.chromaticLocations = {};
    // Circle of fifths positions
    this.fifthLocations = {};
    
    // Initialize
    this.setupNoteColorsAlphas();
  }

  /**
   * Update dimensions based on canvas size
   */
  updateDimensions(w, h) {
    // In WEBGL mode, origin is at center, so we use 0,0
    this.centerX = 0;
    this.centerY = 0;
    this.canvasWidth = w;
    this.canvasHeight = h;
    // Adaptive margin: smaller on small screens
    const margin = min(90, max(40, min(w, h) * 0.15));
    this.radius = min(w / 2, h / 2) - margin;
    // Ensure minimum usable radius
    this.radius = max(80, this.radius);
    // Scale note circles with radius
    this.noteCircumference = max(20, min(40, this.radius * 0.22));
  }

  /**
   * Setup note colors and alpha values
   */
  setupNoteColorsAlphas() {
    // Colors based on circle of fifths relationship (HSB)
    // Using hue values that create nice color distribution
    this.fifthsColors = {
      'C': [0, 155, 255],      // Red family
      'C#': [210, 155, 255],   // Blue family
      'D': [60, 155, 255],     // Yellow family
      'D#': [270, 155, 255],   // Purple family  
      'E': [120, 155, 255],    // Green family
      'F': [330, 155, 255],    // Pink family
      'F#': [180, 155, 255],   // Cyan family
      'G': [30, 155, 255],     // Orange family
      'G#': [240, 155, 255],   // Blue-purple
      'A': [90, 155, 255],     // Yellow-green
      'A#': [300, 155, 255],   // Magenta
      'B': [150, 155, 255]     // Teal
    };
    
    // Colors based on chromatic order (low to high frequency)
    // Hue wraps around the color wheel: A=0° through G#=330°
    this.chromaticColorsMap = {
      'A': [0, 155, 255],      // Red (lowest)
      'A#': [30, 155, 255],    // Orange
      'B': [60, 155, 255],     // Yellow
      'C': [90, 155, 255],     // Yellow-green
      'C#': [120, 155, 255],   // Green
      'D': [150, 155, 255],    // Teal
      'D#': [180, 155, 255],   // Cyan
      'E': [210, 155, 255],    // Light blue
      'F': [240, 155, 255],    // Blue
      'F#': [270, 155, 255],   // Purple
      'G': [300, 155, 255],    // Magenta
      'G#': [330, 155, 255]    // Pink (highest, wraps to red)
    };
    
    // Default to fifths colors
    this.noteColors = this.fifthsColors;

    // Initialize alphas (all visible initially)
    this.noteAlphas = {};
    for (const note of Object.keys(this.noteColors)) {
      this.noteAlphas[note] = 100;
    }

    // Chromatic locations (starting at C = position 0 on top)
    this.chromaticLocations = {
      'A': 0, 'A#': 1, 'B': 2, 'C': 3, 'C#': 4, 'D': 5,
      'D#': 6, 'E': 7, 'F': 8, 'F#': 9, 'G': 10, 'G#': 11
    };

    // Circle of fifths locations
    this.fifthLocations = {
      'A': 0, 'E': 1, 'B': 2, 'F#': 3, 'C#': 4, 'G#': 5,
      'D#': 6, 'A#': 7, 'F': 8, 'C': 9, 'G': 10, 'D': 11
    };

    // Start in C major (C at top)
    this.noteLocations = {
      'A': 9, 'A#': 10, 'B': 11, 'C': 0, 'C#': 1, 'D': 2,
      'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8
    };
  }

  /**
   * Set the current instrument
   */
  setCurrentInstrument(newInstrument) {
    this.currentInstrument = newInstrument;
  }

  /**
   * Set circle of fifths display mode
   */
  setByFifths(toSet) {
    this.byFifths = toSet;
  }
  
  /**
   * Set chromatic color mode (true = chromatic/frequency, false = fifths relationship)
   */
  setChromaticColors(value) {
    this.chromaticColors = value;
    this.noteColors = value ? this.chromaticColorsMap : this.fifthsColors;
  }

  /**
   * Get note at mouse position
   */
  getNote(x, y) {
    for (const note of Object.keys(this.noteLocations)) {
      const noteLoc = this.noteLocations[note];
      const xloc = this.centerX + this.radius * cos(radians(noteLoc * 30 - 90));
      const yloc = this.centerY + this.radius * sin(radians(noteLoc * 30 - 90));
      const pokeDistance = sqrt((x - xloc) * (x - xloc) + (y - yloc) * (y - yloc));
      
      if (pokeDistance < this.noteCircumference / 2) {
        return note;
      }
    }
    return null;
  }

  /**
   * Get note color in HSB array
   */
  getNoteColor(note) {
    return this.noteColors[note];
  }

  /**
   * Get note alpha value
   */
  getNoteAlpha(note) {
    return this.noteAlphas[note];
  }

  /**
   * Update note positions based on fifths mode and root
   * Returns true if any changes were made
   */
  updateNoteLocationsByFifthsAndRoot() {
    let changed = false;
    
    for (const note of Object.keys(this.noteLocations)) {
      let currentPos = this.noteLocations[note];
      const currentRoot = this.musicMaker.getCurrentRoot();
      
      let correctPos = this.byFifths 
        ? this.fifthLocations[note] 
        : this.chromaticLocations[note];
      
      const currentRootAsNumLoc = this.byFifths
        ? this.fifthLocations[currentRoot]
        : this.chromaticLocations[currentRoot];

      correctPos = correctPos - currentRootAsNumLoc;
      if (correctPos >= 12.0) {
        correctPos -= 12.0;
      } else if (correctPos < 0.0) {
        correctPos += 12.0;
      }

      // Smoothly rotate toward correct position
      const rootPos = this.noteLocations[currentRoot];
      if (abs(correctPos - currentPos) >= 0.06) {
        if (rootPos <= 6.0) {
          currentPos -= 0.05;
        } else {
          currentPos += 0.05;
        }
        changed = true;
      } else {
        // Snap to integer once close enough
        currentPos = round(currentPos);
      }

      // Keep in [0, 12)
      if (currentPos >= 12.0) {
        currentPos -= 12.0;
      } else if (currentPos < 0) {
        currentPos += 12.0;
      }

      this.noteLocations[note] = currentPos;
    }
    
    return changed;
  }

  /**
   * Update note alphas based on current scale
   * Returns true if any changes were made
   */
  updateNoteAlphasByCurrentScale() {
    let changed = false;
    
    for (const noteName of Object.keys(this.noteAlphas)) {
      const targetVal = this.musicMaker.isNoteInCurrentScale(noteName) ? 100 : this.minAlpha;
      const oldVal = this.noteAlphas[noteName];
      
      if (abs(targetVal - oldVal) > 0.5) {
        // Smooth interpolation
        this.noteAlphas[noteName] = (targetVal + oldVal * 8) / 9.0;
        changed = true;
      }
    }
    
    return changed;
  }

  /**
   * Main draw method
   */
  draw() {
    this.drawOverallInfo();

    // First update alphas, then positions (prioritize visual feedback)
    let updated = this.updateNoteAlphasByCurrentScale();
    if (!updated) {
      this.updateNoteLocationsByFifthsAndRoot();
    }

    this.drawChords();
    this.drawNotes();
  }

  /**
   * Draw info text
   */
  drawOverallInfo() {
    push();
    colorMode(RGB, 255, 255, 255, 100);
    fill(200, 200, 200, 80);
    
    // In WEBGL mode, coordinates are centered at 0,0
    const leftX = -this.canvasWidth / 2 + 16;
    const topY = -this.canvasHeight / 2 + 12;
    const bottomY = this.canvasHeight / 2 - 12;
    
    // Adaptive text size
    const infoSize = max(12, min(16, this.canvasWidth * 0.025));
    textSize(infoSize);
    textAlign(LEFT, TOP);
    text(this.currentInstrument.getName(), leftX, topY);
    text(this.musicMaker.getCurrentScaleName(), leftX, topY + infoSize + 4);
    
    // Only show keyboard hints on larger screens
    if (this.canvasWidth > 500) {
      textSize(11);
      textAlign(LEFT, BOTTOM);
      fill(150, 150, 150, 60);
      text('1–= All Notes  |  q–] Scale Notes', leftX, bottomY);
    }
    pop();
  }

  /**
   * Draw all notes on the wheel
   */
  drawNotes() {
    textSize(16);
    textAlign(CENTER, CENTER);
    
    for (const noteName of Object.keys(this.noteLocations)) {
      this.drawNote(noteName);
    }
  }

  /**
   * Draw a single note
   */
  drawNote(noteName) {
    push();
    colorMode(RGB, 255, 255, 255, 100);
    
    const noteLoc = this.noteLocations[noteName];
    const xloc = this.centerX + this.radius * cos(radians(noteLoc * 30 - 90));
    const yloc = this.centerY + this.radius * sin(radians(noteLoc * 30 - 90));
    
    // Draw relative indicator (small dot)
    if (noteName === this.musicMaker.getCurrentRelative()) {
      fill(0, 0, 0);
      strokeWeight(1.5);
      stroke(100, 100, 100, this.noteAlphas[noteName]);
      const xlocdot = this.centerX + this.radius * 1.2 * cos(radians(noteLoc * 30 - 90));
      const ylocdot = this.centerY + this.radius * 1.2 * sin(radians(noteLoc * 30 - 90));
      ellipse(xlocdot, ylocdot, 5, 5);
    }
    
    // Draw note circle
    fill(0, 0, 0);
    if (this.musicMaker.isNotePlaying(noteName)) {
      strokeWeight(4);
      colorMode(HSB, 360, 255, 255, 100);
      const c = this.noteColors[noteName];
      stroke(c[0], c[1], c[2]);
    } else {
      strokeWeight(1.5);
      stroke(100, 100, 100, this.noteAlphas[noteName]);
    }
    
    ellipse(xloc, yloc, this.noteCircumference, this.noteCircumference);
    
    // Draw note text
    colorMode(HSB, 360, 255, 255, 100);
    const c = this.noteColors[noteName];
    fill(c[0], c[1], c[2], this.noteAlphas[noteName]);
    noStroke();
    text(noteName, xloc, yloc - 2);
    pop();
  }

  /**
   * Draw detected chords
   */
  drawChords() {
    const chords = this.musicMaker.getCurrentlyPlayingChordsFromNotes(
      this.musicMaker.getCurrentlyPlayingNotes()
    );
    
    for (const chord of Object.keys(chords)) {
      this.drawChord(chord, chords[chord]);
    }
  }

  /**
   * Draw a single chord visualization
   */
  drawChord(chordName, notes) {
    push();
    strokeWeight(0);
    colorMode(HSB, 360, 255, 255, 100);
    
    beginShape();
    let isRoot = true;
    let rootXloc = 0;
    let rootYloc = 0;
    let rootColor = [0, 0, 255];
    
    for (const note of notes) {
      const c = this.noteColors[note];
      fill(c[0], c[1], c[2], this.noteAlphas[note] * 0.5);
      
      const noteLoc = this.noteLocations[note];
      
      if (isRoot) {
        rootColor = c;
        rootXloc += (1.0 / notes.length) * (this.centerX + this.radius * 1.3 * cos(radians(noteLoc * 30 - 90)));
        rootYloc += (1.0 / notes.length) * (this.centerY + this.radius * 1.3 * sin(radians(noteLoc * 30 - 90)));
      } else {
        rootXloc += (1.0 / notes.length) * (this.centerX + this.radius * 1.0 * cos(radians(noteLoc * 30 - 90)));
        rootYloc += (1.0 / notes.length) * (this.centerY + this.radius * 1.0 * sin(radians(noteLoc * 30 - 90)));
      }
      
      // Add two vertices per note for filled shape
      const xloc = this.centerX + this.radius * cos(radians(noteLoc * 30 - 90));
      const yloc = this.centerY + this.radius * sin(radians(noteLoc * 30 - 90));
      const xloc2 = this.centerX + this.radius * cos(radians(noteLoc * 30 - 88));
      const yloc2 = this.centerY + this.radius * sin(radians(noteLoc * 30 - 88));
      
      vertex(xloc, yloc);
      vertex(xloc2, yloc2);
      
      isRoot = false;
    }
    endShape(CLOSE);
    
    // Draw chord name (except for "fifth" chords)
    if (!chordName.endsWith('f')) {
      textSize(16);
      textAlign(CENTER, CENTER);
      
      if (notes.length >= 4) {
        fill(0, 0, 255, 100);
      } else {
        fill(rootColor[0], rootColor[1], rootColor[2]);
      }
      
      text(chordName, rootXloc, rootYloc - 2);
    }
    pop();
  }
}
