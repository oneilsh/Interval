/**
 * SoundVisualizer - Radial FFT-based audio visualization
 * Hybrid approach: FFT energy weighted by playing notes
 * Wraps around the note wheel with spectrum bars
 * Ported from Processing to p5.js
 * Original copyright Shawn T. O'Neil 2013, LGPL
 */

class SoundVisualizer {
  constructor(instrument, musicMaker, scaleVisualizer, x, y, w, h) {
    this.instrument = instrument;
    this.musicMaker = musicMaker;
    this.scaleVisualizer = scaleVisualizer;
    
    // FFT settings
    this.bins = 128;  // More bins for that Winamp look
    this.smoothing = 0.85;
    
    // Visualization settings
    this.maxBarHeight = 80;  // Maximum height of spectrum bars
    this.barGap = 1;         // Gap between bars in degrees
    
    // Visibility toggle
    this.show = false;
    
    // FFT analyzer
    this.fft = null;
    
    // Note activity tracking (smooth animations)
    this.noteActivity = {};
    this.noteHeldTime = {};  // Track how long each note has been held
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    for (const note of notes) {
      this.noteActivity[note] = 0;  // 0 = inactive, 1 = fully active
      this.noteHeldTime[note] = 0;  // Frames held
    }
  }
  
  /**
   * Initialize FFT (must be done after user interaction for audio context)
   */
  initFFT() {
    if (!this.fft) {
      this.fft = new p5.FFT(this.smoothing, this.bins);
    }
  }
  
  /**
   * Set position and size (not used for radial, kept for compatibility)
   */
  setPosition(x, y, w, h) {
    // Not used for radial visualization
  }
  
  /**
   * Set visibility
   */
  setShow(visible) {
    this.show = visible;
    if (visible) {
      this.initFFT();
    }
  }
  
  /**
   * Toggle visibility
   */
  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.initFFT();
    }
    return this.show;
  }
  
  /**
   * Update current instrument reference
   */
  setCurrentInstrument(newInstrument) {
    this.instrument = newInstrument;
  }
  
  /**
   * Update note activity levels based on which notes are playing
   */
  updateNoteActivity() {
    const playingNotes = this.musicMaker.getCurrentlyPlayingNotes();
    
    for (const note of Object.keys(this.noteActivity)) {
      const isPlaying = note in playingNotes;
      const currentActivity = this.noteActivity[note];
      
      if (isPlaying) {
        this.noteHeldTime[note]++;
        
        // Quick attack when note first starts (first ~10 frames)
        if (this.noteHeldTime[note] < 10) {
          this.noteActivity[note] = Math.min(1, currentActivity + 0.15);
        } else {
          // Gradual decay while held (simulating audio envelope decay)
          // Decay faster at first, then slow down
          const decayRate = 0.02 * Math.max(0.3, currentActivity);
          this.noteActivity[note] = Math.max(0.05, currentActivity - decayRate);
        }
      } else {
        // Reset held time
        this.noteHeldTime[note] = 0;
        // Faster decay when note is released
        this.noteActivity[note] = Math.max(0, currentActivity - 0.05);
      }
    }
  }
  
  /**
   * Find which note is closest to a given angle on the wheel
   */
  getNoteAtAngle(angleDegrees) {
    const noteLocations = this.scaleVisualizer.noteLocations;
    let closestNote = null;
    let closestDistance = Infinity;
    
    for (const note of Object.keys(noteLocations)) {
      const noteAngle = (noteLocations[note] * 30);
      let distance = Math.abs(angleDegrees - noteAngle);
      if (distance > 180) {
        distance = 360 - distance;
      }
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestNote = note;
      }
    }
    
    return { note: closestNote, distance: closestDistance };
  }
  
  /**
   * Draw the radial visualization
   */
  draw() {
    if (!this.show) return;
    
    push();
    
    // Make sure FFT is initialized
    if (!this.fft) {
      this.initFFT();
    }
    
    // Update note activity levels
    this.updateNoteActivity();
    
    // Get spectrum data for overall energy
    let spectrum = this.fft ? this.fft.analyze() : [];
    
    // Calculate overall audio energy (average of spectrum)
    let totalEnergy = 0;
    for (let i = 0; i < spectrum.length; i++) {
      totalEnergy += spectrum[i];
    }
    const avgEnergy = spectrum.length > 0 ? totalEnergy / spectrum.length : 0;
    const normalizedEnergy = avgEnergy / 255;  // 0 to 1
    
    // Get wheel properties from ScaleVisualizer
    const centerX = this.scaleVisualizer.centerX;
    const centerY = this.scaleVisualizer.centerY;
    const wheelRadius = this.scaleVisualizer.radius;
    const noteCircumference = this.scaleVisualizer.noteCircumference;
    
    // Start drawing just outside the note circles
    const innerRadius = wheelRadius + noteCircumference / 2 + 5;
    
    // Degrees per bar
    const degreesPerBar = 360 / this.bins;
    
    noStroke();
    
    // Draw each spectrum bar as a radial segment
    for (let i = 0; i < this.bins; i++) {
      // Calculate angle for this bar (0 degrees = top of wheel)
      const barAngle = (i * degreesPerBar);
      
      // For drawing, offset by -90 so 0 degrees is at top
      const drawAngle = barAngle - 90;
      const angleRad = radians(drawAngle);
      const nextAngleRad = radians(drawAngle + degreesPerBar - this.barGap);
      
      // Find which note this bar is closest to
      const { note, distance } = this.getNoteAtAngle(barAngle);
      
      if (note) {
        const noteColor = this.scaleVisualizer.getNoteColor(note);
        const noteAlpha = this.scaleVisualizer.getNoteAlpha(note);
        const noteActivity = this.noteActivity[note];
        
        // Get FFT value for this bar (for variation/texture)
        const fftValue = spectrum[i] || 0;
        const weight = 1 + (i / this.bins) * 2;
        const fftContribution = Math.log(fftValue * weight + 1) * 8;
        
        // Calculate bar height based on:
        // 1. Note activity (is this note playing?)
        // 2. Overall audio energy (makes everything pulse together)
        // 3. FFT value for texture/variation
        const activityHeight = noteActivity * this.maxBarHeight * 0.7;
        const energyHeight = normalizedEnergy * this.maxBarHeight * 0.2;
        const fftHeight = fftContribution * 0.3;
        
        // Ambient minimum for visual interest
        const ambientHeight = 3 + Math.sin(frameCount * 0.05 + i * 0.2) * 2;
        
        // Combine all contributions
        let barHeight = ambientHeight + activityHeight + energyHeight + fftHeight;
        barHeight = constrain(barHeight, 2, this.maxBarHeight);
        
        // Distance fade from note center
        const distanceFade = 1 - Math.min(distance / 15, 1) * 0.4;
        
        // Brightness boost for active notes
        const brightnessBoost = noteActivity * 50;
        
        // Set color
        colorMode(HSB, 360, 255, 255, 100);
        const saturation = Math.min(255, noteColor[1] + noteActivity * 30);
        const brightness = Math.min(255, noteColor[2] + brightnessBoost);
        fill(noteColor[0], saturation, brightness, noteAlpha * 0.75 * distanceFade);
        
        // Calculate the four corners of the bar (trapezoid shape)
        const outerRadius = innerRadius + barHeight;
        
        const x1 = centerX + innerRadius * cos(angleRad);
        const y1 = centerY + innerRadius * sin(angleRad);
        const x2 = centerX + innerRadius * cos(nextAngleRad);
        const y2 = centerY + innerRadius * sin(nextAngleRad);
        const x3 = centerX + outerRadius * cos(nextAngleRad);
        const y3 = centerY + outerRadius * sin(nextAngleRad);
        const x4 = centerX + outerRadius * cos(angleRad);
        const y4 = centerY + outerRadius * sin(angleRad);
        
        // Draw as a quad
        beginShape();
        vertex(x1, y1);
        vertex(x2, y2);
        vertex(x3, y3);
        vertex(x4, y4);
        endShape(CLOSE);
      }
    }
    
    pop();
  }
}
