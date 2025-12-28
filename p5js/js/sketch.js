/**
 * MusicWheel - Main p5.js sketch
 * A music theory visualization tool for exploring notes, chords, scales, and temperaments
 * Ported from Processing to p5.js
 * Original copyright Shawn T. O'Neil 2013, LGPL
 */

// Global instances
let musicMaker;
let soundManager;
let currentInstrument;
let scaleVisualizer;
let soundVisualizer;

// UI elements
let instrumentSelect;
let noteSelect;
let scaleSelect;
let fifthsCheckbox;
let playSelectedBtn;
let helpBtn;
let closeHelpBtn;
let helpPanel;
let loadingOverlay;
let togglePanelBtn;
let controlsPanel;

// State
let isInitialized = false;
let canvasParent;
let isLoadingInstrument = false;

// Font for WEBGL text rendering
let mainFont;

/**
 * Preload - Load font for WEBGL text rendering
 */
function preload() {
  // Load a font for WEBGL mode (using Google Fonts via URL)
  mainFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

/**
 * Setup - Initialize the sketch
 */
function setup() {
  // Get container dimensions
  canvasParent = document.getElementById('canvas-container');
  const w = canvasParent.offsetWidth;
  const h = canvasParent.offsetHeight;
  
  // Create canvas with WEBGL for gradient support
  const canvas = createCanvas(w, h, WEBGL);
  canvas.parent('canvas-container');
  
  // Set target framerate (60 is default, but we can be explicit)
  frameRate(60);
  
  // Set drawing defaults
  strokeWeight(1.5);
  
  // Set font for WEBGL text rendering
  if (mainFont) {
    textFont(mainFont);
  }
  
  // Initialize core objects
  musicMaker = new MusicMaker();
  soundManager = new SoundManager();
  
  // Set up sound manager callbacks
  soundManager.onLoadProgress = (progress, loaded, total) => {
    const progressEl = document.querySelector('.loading-progress');
    if (progressEl) {
      progressEl.textContent = `${loaded} / ${total} sounds`;
    }
  };
  
  soundManager.onLoadComplete = () => {
    hideLoadingOverlay();
    isInitialized = true;
    isLoadingInstrument = false;
  };
  
  // Create instrument with default temperament
  currentInstrument = new Instrument('Equal Tempered', soundManager, musicMaker);
  
  // Create visualizers
  scaleVisualizer = new ScaleVisualizer(musicMaker, currentInstrument);
  scaleVisualizer.updateDimensions(w, h);
  
  // SoundVisualizer position in WEBGL coordinates (bottom-right)
  soundVisualizer = new SoundVisualizer(
    currentInstrument,
    musicMaker,
    scaleVisualizer,
    w / 2 - 210,    // Right side
    h / 2 - 190,    // Bottom
    185,
    100
  );
  
  // Setup UI
  setupUI();
  
  // Load sounds
  loadSoundsForInstrument('Equal Tempered');
}

/**
 * Load sounds for an instrument
 */
async function loadSoundsForInstrument(instrumentName) {
  if (isLoadingInstrument) return;
  isLoadingInstrument = true;
  showLoadingOverlay();
  try {
    await soundManager.loadSounds(instrumentName);
  } catch (error) {
    console.error('Error loading sounds:', error);
    hideLoadingOverlay();
    isLoadingInstrument = false;
  }
}

/**
 * Setup UI elements and event handlers
 */
function setupUI() {
  // Get UI element references
  instrumentSelect = document.getElementById('instrument-select');
  noteSelect = document.getElementById('note-select');
  scaleSelect = document.getElementById('scale-select');
  fifthsCheckbox = document.getElementById('fifths-checkbox');
  playSelectedBtn = document.getElementById('play-selected-btn');
  helpBtn = document.getElementById('help-btn');
  closeHelpBtn = document.getElementById('close-help-btn');
  helpPanel = document.getElementById('help-panel');
  loadingOverlay = document.getElementById('loading-overlay');
  togglePanelBtn = document.getElementById('toggle-panel');
  controlsPanel = document.getElementById('controls-panel');
  
  // Panel toggle
  togglePanelBtn.addEventListener('click', () => {
    controlsPanel.classList.toggle('expanded');
  });
  
  // Dropdown change handlers - apply immediately
  instrumentSelect.addEventListener('change', onInstrumentChange);
  noteSelect.addEventListener('change', onScaleChange);
  scaleSelect.addEventListener('change', onScaleChange);
  
  // Circle of fifths checkbox
  fifthsCheckbox.addEventListener('change', (e) => {
    scaleVisualizer.setByFifths(e.target.checked);
  });
  
  // Play selected button
  playSelectedBtn.addEventListener('click', playSelectedNotes);
  
  // Help panel toggle
  helpBtn.addEventListener('click', () => {
    helpPanel.classList.remove('hidden');
  });
  
  closeHelpBtn.addEventListener('click', () => {
    helpPanel.classList.add('hidden');
  });
  
  // Close help on background click
  helpPanel.addEventListener('click', (e) => {
    if (e.target === helpPanel) {
      helpPanel.classList.add('hidden');
    }
  });
}

/**
 * Handle instrument/temperament change
 */
async function onInstrumentChange() {
  const instrumentName = instrumentSelect.value;
  
  if (instrumentName !== currentInstrument.getName()) {
    await loadSoundsForInstrument(instrumentName);
    currentInstrument = new Instrument(instrumentName, soundManager, musicMaker);
    scaleVisualizer.setCurrentInstrument(currentInstrument);
    soundVisualizer.setCurrentInstrument(currentInstrument);
    console.log(`Changed to ${instrumentName}`);
  }
}

/**
 * Handle scale/root note change
 */
function onScaleChange() {
  const rootNote = noteSelect.value;
  const scaleType = scaleSelect.value;
  musicMaker.setScale(rootNote, scaleType);
  console.log(`Changed to ${rootNote} ${scaleType}`);
}

/**
 * Play all currently selected notes
 */
function playSelectedNotes() {
  const currentlyPlaying = musicMaker.getCurrentlyPlayingNotes();
  for (const note of Object.keys(currentlyPlaying)) {
    currentInstrument.playNote(note);
  }
}

/**
 * Show loading overlay
 */
function showLoadingOverlay() {
  if (loadingOverlay) {
    loadingOverlay.classList.remove('hidden');
  }
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }
}

/**
 * Main draw loop
 */
function draw() {
  background(10, 10, 15);
  
  if (scaleVisualizer) {
    scaleVisualizer.draw();
  }
  
  if (soundVisualizer) {
    soundVisualizer.draw();
  }
}

/**
 * Window resize handler
 */
function windowResized() {
  if (canvasParent) {
    const w = canvasParent.offsetWidth;
    const h = canvasParent.offsetHeight;
    resizeCanvas(w, h);
    
    if (scaleVisualizer) {
      scaleVisualizer.updateDimensions(w, h);
    }
    
    if (soundVisualizer) {
      // WEBGL coordinates for bottom-right position
      soundVisualizer.setPosition(w / 2 - 210, h / 2 - 190, 185, 100);
    }
  }
}

/**
 * Key pressed handler - play notes via keyboard
 */
function keyPressed() {
  if (!isInitialized) return;
  
  // Don't capture keys when typing in inputs
  if (document.activeElement.tagName === 'INPUT' || 
      document.activeElement.tagName === 'SELECT' ||
      document.activeElement.tagName === 'TEXTAREA') {
    return;
  }
  
  let note = '';
  
  // Scale notes: q through ]
  if (key === 'q') note = musicMaker.getNoteNameFromNumberInCurrentScale(1);
  else if (key === 'w') note = musicMaker.getNoteNameFromNumberInCurrentScale(2);
  else if (key === 'e') note = musicMaker.getNoteNameFromNumberInCurrentScale(3);
  else if (key === 'r') note = musicMaker.getNoteNameFromNumberInCurrentScale(4);
  else if (key === 't') note = musicMaker.getNoteNameFromNumberInCurrentScale(5);
  else if (key === 'y') note = musicMaker.getNoteNameFromNumberInCurrentScale(6);
  else if (key === 'u') note = musicMaker.getNoteNameFromNumberInCurrentScale(7);
  else if (key === 'i') note = musicMaker.getNoteNameFromNumberInCurrentScale(8);
  else if (key === 'o') note = musicMaker.getNoteNameFromNumberInCurrentScale(9);
  else if (key === 'p') note = musicMaker.getNoteNameFromNumberInCurrentScale(10);
  else if (key === '[') note = musicMaker.getNoteNameFromNumberInCurrentScale(11);
  else if (key === ']') note = musicMaker.getNoteNameFromNumberInCurrentScale(12);
  else if (key === '\\') note = musicMaker.getNoteNameFromNumberInCurrentScale(13);
  
  // Chromatic notes: 1 through =
  else if (key === '1') note = musicMaker.getNoteNameFromNumRelativeToRoot(0);
  else if (key === '2') note = musicMaker.getNoteNameFromNumRelativeToRoot(1);
  else if (key === '3') note = musicMaker.getNoteNameFromNumRelativeToRoot(2);
  else if (key === '4') note = musicMaker.getNoteNameFromNumRelativeToRoot(3);
  else if (key === '5') note = musicMaker.getNoteNameFromNumRelativeToRoot(4);
  else if (key === '6') note = musicMaker.getNoteNameFromNumRelativeToRoot(5);
  else if (key === '7') note = musicMaker.getNoteNameFromNumRelativeToRoot(6);
  else if (key === '8') note = musicMaker.getNoteNameFromNumRelativeToRoot(7);
  else if (key === '9') note = musicMaker.getNoteNameFromNumRelativeToRoot(8);
  else if (key === '0') note = musicMaker.getNoteNameFromNumRelativeToRoot(9);
  else if (key === '-') note = musicMaker.getNoteNameFromNumRelativeToRoot(10);
  else if (key === '=') note = musicMaker.getNoteNameFromNumRelativeToRoot(11);
  
  // Escape to close help
  else if (keyCode === ESCAPE) {
    helpPanel.classList.add('hidden');
    return;
  }
  
  if (note !== '') {
    if (!musicMaker.isNotePlaying(note)) {
      currentInstrument.playNote(note);
    }
    musicMaker.addPlayingNote(note);
  }
}

/**
 * Key released handler - stop notes
 */
function keyReleased() {
  if (!isInitialized) return;
  
  let note = '';
  
  // Scale notes: q through ]
  if (key === 'q') note = musicMaker.getNoteNameFromNumberInCurrentScale(1);
  else if (key === 'w') note = musicMaker.getNoteNameFromNumberInCurrentScale(2);
  else if (key === 'e') note = musicMaker.getNoteNameFromNumberInCurrentScale(3);
  else if (key === 'r') note = musicMaker.getNoteNameFromNumberInCurrentScale(4);
  else if (key === 't') note = musicMaker.getNoteNameFromNumberInCurrentScale(5);
  else if (key === 'y') note = musicMaker.getNoteNameFromNumberInCurrentScale(6);
  else if (key === 'u') note = musicMaker.getNoteNameFromNumberInCurrentScale(7);
  else if (key === 'i') note = musicMaker.getNoteNameFromNumberInCurrentScale(8);
  else if (key === 'o') note = musicMaker.getNoteNameFromNumberInCurrentScale(9);
  else if (key === 'p') note = musicMaker.getNoteNameFromNumberInCurrentScale(10);
  else if (key === '[') note = musicMaker.getNoteNameFromNumberInCurrentScale(11);
  else if (key === ']') note = musicMaker.getNoteNameFromNumberInCurrentScale(12);
  else if (key === '\\') note = musicMaker.getNoteNameFromNumberInCurrentScale(13);
  
  // Chromatic notes: 1 through =
  else if (key === '1') note = musicMaker.getNoteNameFromNumRelativeToRoot(0);
  else if (key === '2') note = musicMaker.getNoteNameFromNumRelativeToRoot(1);
  else if (key === '3') note = musicMaker.getNoteNameFromNumRelativeToRoot(2);
  else if (key === '4') note = musicMaker.getNoteNameFromNumRelativeToRoot(3);
  else if (key === '5') note = musicMaker.getNoteNameFromNumRelativeToRoot(4);
  else if (key === '6') note = musicMaker.getNoteNameFromNumRelativeToRoot(5);
  else if (key === '7') note = musicMaker.getNoteNameFromNumRelativeToRoot(6);
  else if (key === '8') note = musicMaker.getNoteNameFromNumRelativeToRoot(7);
  else if (key === '9') note = musicMaker.getNoteNameFromNumRelativeToRoot(8);
  else if (key === '0') note = musicMaker.getNoteNameFromNumRelativeToRoot(9);
  else if (key === '-') note = musicMaker.getNoteNameFromNumRelativeToRoot(10);
  else if (key === '=') note = musicMaker.getNoteNameFromNumRelativeToRoot(11);
  
  if (note !== '') {
    if (musicMaker.isNotePlaying(note)) {
      currentInstrument.stopNote(note);
    }
    musicMaker.releasePlayingNote(note);
  }
}

/**
 * Mouse pressed handler - toggle notes on click
 */
function mousePressed() {
  if (!isInitialized || !scaleVisualizer) return;
  
  // Check if click is on canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  
  // Convert screen coordinates to WEBGL coordinates (centered at 0,0)
  const webglX = mouseX - width / 2;
  const webglY = mouseY - height / 2;
  
  const notePoked = scaleVisualizer.getNote(webglX, webglY);
  
  if (notePoked !== null) {
    if (musicMaker.isNotePlaying(notePoked)) {
      currentInstrument.stopNote(notePoked);
      musicMaker.releasePlayingNote(notePoked);
    } else {
      currentInstrument.playNote(notePoked);
      musicMaker.addPlayingNote(notePoked);
    }
  }
}
