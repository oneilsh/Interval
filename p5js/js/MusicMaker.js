/**
 * MusicMaker - Music theory logic for scales, notes, chords, and fifths
 * Ported from Processing to p5.js
 * Original copyright Shawn T. O'Neil 2013, LGPL
 */

class MusicMaker {
  constructor() {
    // Maps scale type names to interval patterns
    this.scaleTypesToPatterns = {};
    // Maps note names to numbers (A=0, A#=1, etc.)
    this.notesToNumbers = {};
    // Maps numbers to note names (0=A, 1=A#, etc.)
    this.numbersToNotes = {};
    // Maps chord type suffixes to interval patterns
    this.chordTypesToNoteLists = {};
    // Circle of fifths mapping
    this.fifths = {};
    // Current scale pattern
    this.currentPattern = [];
    // Notes in current scale
    this.currentScaleNotes = {};
    // Current root note
    this.currentRoot = 'C';
    // Current scale type
    this.currentScaleType = 'Major';
    // Currently playing notes
    this.currentlyPlayingNotes = {};

    // Initialize all mappings
    this.setupNotesToNumbers();
    this.setupNumbersToNotes();
    this.setupFifths();
    this.setupScaleTypesToPatterns();
    this.setupChordsToNoteLists();
    this.setScale('C', 'Major');
  }

  /**
   * Setup note name to number mapping (A=0 through G#=11)
   */
  setupNotesToNumbers() {
    this.notesToNumbers = {
      'A': 0, 'A#': 1, 'B': 2, 'C': 3, 'C#': 4, 'D': 5,
      'D#': 6, 'E': 7, 'F': 8, 'F#': 9, 'G': 10, 'G#': 11
    };
  }

  /**
   * Setup number to note name mapping (0=A through 11=G#)
   */
  setupNumbersToNotes() {
    this.numbersToNotes = {
      0: 'A', 1: 'A#', 2: 'B', 3: 'C', 4: 'C#', 5: 'D',
      6: 'D#', 7: 'E', 8: 'F', 9: 'F#', 10: 'G', 11: 'G#'
    };
  }

  /**
   * Setup circle of fifths relationships
   */
  setupFifths() {
    this.fifths = {
      'A': 'E', 'E': 'B', 'B': 'F#', 'F#': 'C#', 'C#': 'G#', 'G#': 'D#',
      'D#': 'A#', 'A#': 'F', 'F': 'C', 'C': 'G', 'G': 'D', 'D': 'A'
    };
  }

  /**
   * Setup scale type patterns (intervals from root)
   */
  setupScaleTypesToPatterns() {
    this.scaleTypesToPatterns = {
      'Major': [0, 2, 4, 5, 7, 9, 11],
      'Minor': [0, 2, 3, 5, 7, 8, 10],
      'Minor Pent.': [0, 3, 5, 7, 10],
      'Major Pent.': [0, 2, 4, 7, 9],
      'Blues': [0, 3, 5, 6, 7, 10]
    };
  }

  /**
   * Setup chord type interval patterns
   */
  setupChordsToNoteLists() {
    this.chordTypesToNoteLists = {
      '': [0, 4, 7],           // Major
      '7': [0, 4, 7, 10],      // Dominant 7th
      'M7': [0, 4, 7, 11],     // Major 7th
      'm': [0, 3, 7],          // Minor
      'm7': [0, 3, 7, 10],     // Minor 7th
      'f': [0, 7],             // Power chord (fifth)
      'dim': [0, 3, 6],        // Diminished
      'ø7': [0, 3, 6, 10],     // Half-diminished 7th
      'dim7': [0, 3, 6, 9],    // Diminished 7th
      'aug': [0, 4, 8]         // Augmented
    };
  }

  /**
   * Get notes to numbers mapping
   */
  getNotesToNumbers() {
    return this.notesToNumbers;
  }

  /**
   * Get the fifth of a note
   */
  getFifth(note) {
    return this.fifths[note];
  }

  /**
   * Get fifths starting from current root
   */
  getFifthsFromCurrentRoot() {
    const result = [this.currentRoot];
    let lastAdded = this.currentRoot;
    for (let i = 1; i < 12; i++) {
      result.push(this.fifths[lastAdded]);
      lastAdded = this.fifths[lastAdded];
    }
    return result;
  }

  /**
   * Get current scale display name
   */
  getCurrentScaleName() {
    return `${this.currentRoot} ${this.currentScaleType}`;
  }

  /**
   * Get current root note
   */
  getCurrentRoot() {
    return this.currentRoot;
  }

  /**
   * Get currently playing notes
   */
  getCurrentlyPlayingNotes() {
    return this.currentlyPlayingNotes;
  }

  /**
   * Add a note to currently playing
   */
  addPlayingNote(noteName) {
    this.currentlyPlayingNotes[noteName] = 1;
  }

  /**
   * Remove a note from currently playing
   */
  releasePlayingNote(noteName) {
    if (this.currentlyPlayingNotes[noteName]) {
      delete this.currentlyPlayingNotes[noteName];
    }
  }

  /**
   * Check if a note is in the current scale
   */
  isNoteInCurrentScale(theNote) {
    return this.currentScaleNotes[theNote] !== undefined;
  }

  /**
   * Set the current scale
   */
  setScale(root, type) {
    this.currentRoot = root;
    this.currentScaleType = type;
    this.currentPattern = this.scaleTypesToPatterns[type];
    this.currentScaleNotes = {};
    
    for (let i = 1; i <= this.currentPattern.length; i++) {
      const name = this.getNoteNameFromNumberInCurrentScale(i);
      this.currentScaleNotes[name] = 1;
    }
  }

  /**
   * Get note name from number relative to root (chromatic)
   */
  getNoteNameFromNumRelativeToRoot(theNum) {
    const rootNum = this.getNumFromNoteName(this.currentRoot);
    const playNum = (rootNum + theNum) % 12;
    return this.getNoteNameFromNum(playNum);
  }

  /**
   * Check if a note is currently playing
   */
  isNotePlaying(name) {
    return this.currentlyPlayingNotes[name] !== undefined;
  }

  /**
   * Get note name from position in current scale (1-indexed)
   */
  getNoteNameFromNumberInCurrentScale(theNum) {
    const rootNum = this.getNumFromNoteName(this.currentRoot);
    let patternIndex = theNum - 1;
    patternIndex = patternIndex % this.currentPattern.length;
    const patternNum = this.currentPattern[patternIndex];
    const noteNum = (rootNum + patternNum) % 12;
    return this.getNoteNameFromNum(noteNum);
  }

  /**
   * Get the relative major/minor of current scale
   */
  getCurrentRelative() {
    if (!this.currentScaleType.startsWith('Major')) {
      // For minor scales, relative major is 3 semitones up
      return this.getNoteNameFromNum((this.getNumFromNoteName(this.currentRoot) + 3) % 12);
    } else {
      // For major scales, relative minor is 3 semitones down
      return this.getNoteNameFromNum((this.getNumFromNoteName(this.currentRoot) - 3 + 12) % 12);
    }
  }

  /**
   * Detect chords from currently playing notes
   */
  getCurrentlyPlayingChordsFromNotes(currentNotes) {
    const retMap = {};
    
    for (const potentialRoot of Object.keys(currentNotes)) {
      const potentialRootNum = this.getNumFromNoteName(potentialRoot);
      
      for (const potentialChordType of Object.keys(this.chordTypesToNoteLists)) {
        const potentialChord = potentialRoot + potentialChordType;
        const potentialChordNotes = [];
        const potentialChordPattern = this.chordTypesToNoteLists[potentialChordType];
        let isChordType = true;
        
        for (const relNoteNeededNum of potentialChordPattern) {
          const absNoteNeededNum = (potentialRootNum + relNoteNeededNum) % 12;
          const absNoteNeeded = this.getNoteNameFromNum(absNoteNeededNum);
          potentialChordNotes.push(absNoteNeeded);
          
          if (!currentNotes[absNoteNeeded]) {
            isChordType = false;
          }
        }
        
        if (isChordType) {
          retMap[potentialChord] = potentialChordNotes;
        }
      }
    }
    
    return retMap;
  }

  /**
   * Get note name from number
   */
  getNoteNameFromNum(theNum) {
    return this.numbersToNotes[theNum];
  }

  /**
   * Get number from note name
   */
  getNumFromNoteName(name) {
    return this.notesToNumbers[name];
  }
}

