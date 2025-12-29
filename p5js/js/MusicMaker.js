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
    
    // Note frequencies (A4 = 440Hz, octave 4)
    this.noteFrequencies = {
      'A': 440.00, 'A#': 466.16, 'B': 493.88, 'C': 523.25,
      'C#': 554.37, 'D': 587.33, 'D#': 622.25, 'E': 659.26,
      'F': 698.46, 'F#': 739.99, 'G': 783.99, 'G#': 830.61
    };
    
    // Scale degree names
    this.scaleDegreeNames = ['1 (Root)', '2', '3', '4', '5', '6', '7'];
    
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
   * Get frequency for a note (approximate, A4=440Hz basis)
   */
  getNoteFrequency(note) {
    return this.noteFrequencies[note] || 440;
  }
  
  /**
   * Get scale degree of a note (1-based, or null if not in scale)
   */
  getScaleDegree(note) {
    const noteNum = this.notesToNumbers[note];
    const rootNum = this.notesToNumbers[this.currentRoot];
    const interval = (noteNum - rootNum + 12) % 12;
    
    const degreeIndex = this.currentPattern.indexOf(interval);
    if (degreeIndex === -1) {
      return null; // Not in scale
    }
    return degreeIndex + 1;
  }
  
  /**
   * Get scale degree name (1=Root, 2, 3, etc.)
   */
  getScaleDegreeName(note) {
    const degree = this.getScaleDegree(note);
    if (degree === null) return null;
    if (degree === 1) return '1 (Root)';
    return degree.toString();
  }
  
  /**
   * Get full info about a note for tooltip display
   */
  getNoteInfo(note) {
    const freq = this.getNoteFrequency(note);
    const degree = this.getScaleDegree(note);
    const degreeName = degree ? this.getScaleDegreeName(note) : 'Not in scale';
    const inScale = this.currentScaleNotes[note] !== undefined;
    
    // Get display name (with unicode sharp)
    const displayName = note.replace('#', '\u266F');
    
    return {
      name: note,
      displayName: displayName,
      frequency: freq,
      scaleDegree: degree,
      scaleDegreeName: degreeName,
      inScale: inScale
    };
  }
  
  /**
   * Setup common chord progressions
   * Each progression uses scale degrees (1-7) which are mode-aware
   * The actual chord quality is derived from the current scale
   */
  setupChordProgressions() {
    // Progressions use scale degrees 1-7
    // Roman numerals are just labels - actual quality comes from the scale
    this.chordProgressions = {
      '1-4-5-1': {
        name: '1-4-5-1 (Classic)',
        steps: [1, 4, 5, 1]
      },
      '1-5-6-4': {
        name: '1-5-6-4 (Pop)',
        steps: [1, 5, 6, 4]
      },
      '2-5-1': {
        name: '2-5-1 (Jazz)',
        steps: [2, 5, 1]
      },
      '1-6-4-5': {
        name: '1-6-4-5 (50s)',
        steps: [1, 6, 4, 5]
      },
      '6-4-1-5': {
        name: '6-4-1-5',
        steps: [6, 4, 1, 5]
      },
      '1-4-6-5': {
        name: '1-4-6-5',
        steps: [1, 4, 6, 5]
      },
      '12 Bar Blues': {
        name: '12 Bar Blues',
        steps: [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5]
      }
    };
  }
  
  /**
   * Get the chord quality for a scale degree based on the current scale
   * Returns: '', 'm', 'dim', or 'aug'
   */
  getChordQualityForDegree(degree) {
    // degree is 1-7
    if (this.currentPattern.length < 5) {
      // Pentatonic scales - just use root, third, fifth from available notes
      return '';  // Default to major-ish for pentatonic
    }
    
    const rootIndex = degree - 1;
    if (rootIndex < 0 || rootIndex >= this.currentPattern.length) {
      return '';
    }
    
    // Get the intervals from this scale degree
    const rootInterval = this.currentPattern[rootIndex];
    const thirdIndex = (rootIndex + 2) % this.currentPattern.length;
    const fifthIndex = (rootIndex + 4) % this.currentPattern.length;
    
    // Calculate intervals relative to the chord root
    let thirdInterval = this.currentPattern[thirdIndex] - rootInterval;
    let fifthInterval = this.currentPattern[fifthIndex] - rootInterval;
    
    // Handle wrapping
    if (thirdInterval < 0) thirdInterval += 12;
    if (fifthInterval < 0) fifthInterval += 12;
    
    // Determine chord quality based on intervals
    // Major third = 4 semitones, Minor third = 3 semitones
    // Perfect fifth = 7 semitones, Diminished fifth = 6 semitones, Augmented fifth = 8 semitones
    
    const isMajorThird = thirdInterval === 4;
    const isMinorThird = thirdInterval === 3;
    const isPerfectFifth = fifthInterval === 7;
    const isDiminishedFifth = fifthInterval === 6;
    const isAugmentedFifth = fifthInterval === 8;
    
    if (isMinorThird && isDiminishedFifth) {
      return 'dim';
    } else if (isMajorThird && isAugmentedFifth) {
      return 'aug';
    } else if (isMinorThird) {
      return 'm';
    } else {
      return '';  // Major
    }
  }
  
  /**
   * Get the Roman numeral label for a chord (based on quality)
   */
  getRomanNumeral(degree, quality) {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    let numeral = numerals[degree - 1] || 'I';
    
    if (quality === 'm' || quality === 'dim') {
      numeral = numeral.toLowerCase();
    }
    if (quality === 'dim') {
      numeral += '°';
    } else if (quality === 'aug') {
      numeral += '+';
    }
    
    return numeral;
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
   * Get current progression chord info (mode-aware)
   */
  getCurrentProgressionChord() {
    if (!this.currentProgression) return null;
    
    const prog = this.chordProgressions[this.currentProgression];
    if (!prog) return null;
    
    const scaleDegree = prog.steps[this.progressionStep];
    
    // Get the note for this scale degree
    const chordRoot = this.getNoteForScaleDegree(scaleDegree);
    if (!chordRoot) return null;
    
    // Get the chord quality based on the current scale
    const quality = this.getChordQualityForDegree(scaleDegree);
    
    // Get Roman numeral representation
    const romanNumeral = this.getRomanNumeral(scaleDegree, quality);
    
    // Quality display symbol
    let qualitySymbol = '';
    if (quality === 'm') qualitySymbol = 'm';
    else if (quality === 'dim') qualitySymbol = '°';
    else if (quality === 'aug') qualitySymbol = '+';
    
    return {
      root: chordRoot,
      quality: quality,
      scaleDegree: scaleDegree,
      romanNumeral: romanNumeral,
      step: this.progressionStep + 1,
      total: prog.steps.length,
      displayName: `${chordRoot}${qualitySymbol} (${romanNumeral})`
    };
  }
  
  /**
   * Get the note name for a scale degree (1-7)
   */
  getNoteForScaleDegree(degree) {
    if (degree < 1 || degree > this.currentPattern.length) {
      // For pentatonic scales with fewer notes, wrap around
      degree = ((degree - 1) % this.currentPattern.length) + 1;
    }
    
    const rootNum = this.notesToNumbers[this.currentRoot];
    const interval = this.currentPattern[degree - 1];
    const noteNum = (rootNum + interval) % 12;
    return this.numbersToNotes[noteNum];
  }
  
  /**
   * Get notes for current progression chord (mode-aware)
   */
  getCurrentProgressionNotes() {
    const chord = this.getCurrentProgressionChord();
    if (!chord) return [];
    
    // Get chord intervals based on quality
    let intervals;
    if (chord.quality === 'm') {
      intervals = [0, 3, 7];  // Minor triad
    } else if (chord.quality === 'dim') {
      intervals = [0, 3, 6];  // Diminished
    } else if (chord.quality === 'aug') {
      intervals = [0, 4, 8];  // Augmented
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
    this.progressionStep = (this.progressionStep + 1) % prog.steps.length;
    return this.getCurrentProgressionChord();
  }
  
  /**
   * Step to previous chord in progression
   */
  prevProgressionStep() {
    if (!this.currentProgression) return null;
    
    const prog = this.chordProgressions[this.currentProgression];
    this.progressionStep = (this.progressionStep - 1 + prog.steps.length) % prog.steps.length;
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

