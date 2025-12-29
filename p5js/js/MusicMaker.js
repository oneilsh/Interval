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

    // Chord progression state
    this.currentProgression = null;
    this.progressionStep = 0;
    
    // Initialize all mappings
    this.setupNotesToNumbers();
    this.setupNumbersToNotes();
    this.setupFifths();
    this.setupScaleTypesToPatterns();
    this.setupChordsToNoteLists();
    this.setupChordProgressions();
    this.setScale('C', 'Major');
  }
  
  /**
   * Setup common chord progressions
   * Each progression is an array of [degree, quality] pairs
   * Degrees are semitones from root, quality is chord suffix
   */
  setupChordProgressions() {
    this.chordProgressions = {
      'I-IV-V-I': [
        { degree: 0, quality: '', name: 'I' },
        { degree: 5, quality: '', name: 'IV' },
        { degree: 7, quality: '', name: 'V' },
        { degree: 0, quality: '', name: 'I' }
      ],
      'I-V-vi-IV': [
        { degree: 0, quality: '', name: 'I' },
        { degree: 7, quality: '', name: 'V' },
        { degree: 9, quality: 'm', name: 'vi' },
        { degree: 5, quality: '', name: 'IV' }
      ],
      'ii-V-I': [
        { degree: 2, quality: 'm', name: 'ii' },
        { degree: 7, quality: '', name: 'V' },
        { degree: 0, quality: '', name: 'I' }
      ],
      'I-vi-IV-V': [
        { degree: 0, quality: '', name: 'I' },
        { degree: 9, quality: 'm', name: 'vi' },
        { degree: 5, quality: '', name: 'IV' },
        { degree: 7, quality: '', name: 'V' }
      ],
      'vi-IV-I-V': [
        { degree: 9, quality: 'm', name: 'vi' },
        { degree: 5, quality: '', name: 'IV' },
        { degree: 0, quality: '', name: 'I' },
        { degree: 7, quality: '', name: 'V' }
      ],
      'I-IV-vi-V': [
        { degree: 0, quality: '', name: 'I' },
        { degree: 5, quality: '', name: 'IV' },
        { degree: 9, quality: 'm', name: 'vi' },
        { degree: 7, quality: '', name: 'V' }
      ],
      '12 Bar Blues': [
        { degree: 0, quality: '', name: 'I' },
        { degree: 0, quality: '', name: 'I' },
        { degree: 0, quality: '', name: 'I' },
        { degree: 0, quality: '', name: 'I' },
        { degree: 5, quality: '', name: 'IV' },
        { degree: 5, quality: '', name: 'IV' },
        { degree: 0, quality: '', name: 'I' },
        { degree: 0, quality: '', name: 'I' },
        { degree: 7, quality: '', name: 'V' },
        { degree: 5, quality: '', name: 'IV' },
        { degree: 0, quality: '', name: 'I' },
        { degree: 7, quality: '', name: 'V' }
      ]
    };
  }
  
  /**
   * Get list of available progressions
   */
  getProgressionNames() {
    return Object.keys(this.chordProgressions);
  }
  
  /**
   * Set current progression
   */
  setProgression(name) {
    if (name === 'None' || !name) {
      this.currentProgression = null;
      this.progressionStep = 0;
      return null;
    }
    this.currentProgression = name;
    this.progressionStep = 0;
    return this.getCurrentProgressionChord();
  }
  
  /**
   * Get current progression chord info
   */
  getCurrentProgressionChord() {
    if (!this.currentProgression) return null;
    
    const prog = this.chordProgressions[this.currentProgression];
    if (!prog) return null;
    
    const step = prog[this.progressionStep];
    const rootNum = this.notesToNumbers[this.currentRoot];
    const chordRootNum = (rootNum + step.degree) % 12;
    const chordRoot = this.numbersToNotes[chordRootNum];
    
    return {
      root: chordRoot,
      quality: step.quality,
      name: step.name,
      step: this.progressionStep + 1,
      total: prog.length,
      displayName: `${chordRoot}${step.quality} (${step.name})`
    };
  }
  
  /**
   * Get notes for current progression chord
   */
  getCurrentProgressionNotes() {
    const chord = this.getCurrentProgressionChord();
    if (!chord) return [];
    
    // Get chord intervals based on quality
    let intervals;
    if (chord.quality === 'm') {
      intervals = [0, 3, 7];  // Minor triad
    } else if (chord.quality === '7') {
      intervals = [0, 4, 7, 10];  // Dominant 7th
    } else if (chord.quality === 'dim') {
      intervals = [0, 3, 6];  // Diminished
    } else {
      intervals = [0, 4, 7];  // Major triad
    }
    
    const rootNum = this.notesToNumbers[chord.root];
    return intervals.map(i => this.numbersToNotes[(rootNum + i) % 12]);
  }
  
  /**
   * Step to next chord in progression
   */
  nextProgressionStep() {
    if (!this.currentProgression) return null;
    
    const prog = this.chordProgressions[this.currentProgression];
    this.progressionStep = (this.progressionStep + 1) % prog.length;
    return this.getCurrentProgressionChord();
  }
  
  /**
   * Step to previous chord in progression
   */
  prevProgressionStep() {
    if (!this.currentProgression) return null;
    
    const prog = this.chordProgressions[this.currentProgression];
    this.progressionStep = (this.progressionStep - 1 + prog.length) % prog.length;
    return this.getCurrentProgressionChord();
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
      // Basic scales
      'Major': [0, 2, 4, 5, 7, 9, 11],
      'Minor': [0, 2, 3, 5, 7, 8, 10],
      'Minor Pent.': [0, 3, 5, 7, 10],
      'Major Pent.': [0, 2, 4, 7, 9],
      'Blues': [0, 3, 5, 6, 7, 10],
      // Modes (rotations of major scale)
      'Ionian': [0, 2, 4, 5, 7, 9, 11],      // Same as Major
      'Dorian': [0, 2, 3, 5, 7, 9, 10],      // Minor with raised 6th
      'Phrygian': [0, 1, 3, 5, 7, 8, 10],    // Minor with lowered 2nd
      'Lydian': [0, 2, 4, 6, 7, 9, 11],      // Major with raised 4th
      'Mixolydian': [0, 2, 4, 5, 7, 9, 10],  // Major with lowered 7th
      'Aeolian': [0, 2, 3, 5, 7, 8, 10],     // Same as Minor
      'Locrian': [0, 1, 3, 5, 6, 8, 10]      // Diminished feel
    };
    
    // Mode relationships: which major scale each mode comes from
    // e.g., D Dorian uses the same notes as C Major
    this.modeParents = {
      'Ionian': 0,     // Root is parent major
      'Dorian': -2,    // 2 semitones below = parent major
      'Phrygian': -4,  // 4 semitones below = parent major
      'Lydian': -5,    // 5 semitones below = parent major
      'Mixolydian': -7,// 7 semitones below = parent major
      'Aeolian': -9,   // 9 semitones below = parent major (relative major)
      'Locrian': -11   // 11 semitones below = parent major
    };
  }
  
  /**
   * Get the parent major key for a mode
   * e.g., D Dorian → C Major
   */
  getParentMajorKey(root, scaleType) {
    if (this.modeParents[scaleType] === undefined) {
      return null;
    }
    const rootNum = this.notesToNumbers[root];
    const parentNum = (rootNum + this.modeParents[scaleType] + 12) % 12;
    return this.numbersToNotes[parentNum];
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
   * Get current scale type
   */
  getCurrentScaleType() {
    return this.currentScaleType;
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
   * Major-type scales show relative minor (3 semitones down)
   * Minor-type scales show relative major (3 semitones up)
   */
  getCurrentRelative() {
    // Major-sounding scales/modes
    const majorTypes = ['Major', 'Ionian', 'Lydian', 'Mixolydian', 'Major Pent.'];
    const isMajorType = majorTypes.includes(this.currentScaleType);
    
    if (isMajorType) {
      // For major-type scales, relative minor is 3 semitones down
      return this.getNoteNameFromNum((this.getNumFromNoteName(this.currentRoot) - 3 + 12) % 12);
    } else {
      // For minor-type scales (Minor, Aeolian, Dorian, Phrygian, Locrian, Minor Pent., Blues)
      // Relative major is 3 semitones up
      return this.getNoteNameFromNum((this.getNumFromNoteName(this.currentRoot) + 3) % 12);
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

