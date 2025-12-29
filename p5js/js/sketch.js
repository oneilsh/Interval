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
let sequencePlayer;

// UI elements
let instrumentSelect;
let noteSelect;
let scaleSelect;
let fifthsCheckbox;
let chromaticColorsCheckbox;
let visualizerCheckbox;
let helpBtn;
let progressionSelect;
let playProgBtn;
let speedSelect;
let progressionDisplay;
let progressionControls;
let progressionInterval = null;
let isProgressionPlaying = false;
let closeHelpBtn;
let helpPanel;
let loadingOverlay;
let togglePanelBtn;
let controlsPanel;

// State
let isInitialized = false;
let canvasParent;
let isLoadingInstrument = false;

// Tooltip
let noteTooltip;
let lastHoveredNote = null;

// Help status bar
let helpStatusBar;
let isHelpVisible = false;

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
  
  // SoundVisualizer - radial visualization around the wheel
  soundVisualizer = new SoundVisualizer(
    currentInstrument,
    musicMaker,
    scaleVisualizer
  );
  
  // Create sequence player for demos
  sequencePlayer = new SequencePlayer(musicMaker, currentInstrument, scaleVisualizer);
  
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
  chromaticColorsCheckbox = document.getElementById('chromatic-colors-checkbox');
  visualizerCheckbox = document.getElementById('visualizer-checkbox');
  helpBtn = document.getElementById('help-btn');
  closeHelpBtn = document.getElementById('close-help-btn');
  progressionSelect = document.getElementById('progression-select');
  playProgBtn = document.getElementById('play-prog-btn');
  speedSelect = document.getElementById('speed-select');
  progressionDisplay = document.getElementById('progression-display');
  progressionControls = document.getElementById('progression-controls');
  helpPanel = document.getElementById('help-panel');
  loadingOverlay = document.getElementById('loading-overlay');
  togglePanelBtn = document.getElementById('toggle-panel');
  controlsPanel = document.getElementById('controls-panel');
  noteTooltip = document.getElementById('note-tooltip');
  helpStatusBar = document.getElementById('help-status-bar');
  
  // Panel toggle
  togglePanelBtn.addEventListener('click', () => {
    controlsPanel.classList.toggle('expanded');
    // Update wheel position based on panel state
    const isExpanded = controlsPanel.classList.contains('expanded');
    if (scaleVisualizer) {
      scaleVisualizer.setPanelExpanded(isExpanded);
    }
  });
  
  // Dropdown change handlers - apply immediately
  instrumentSelect.addEventListener('change', onInstrumentChange);
  noteSelect.addEventListener('change', onScaleChange);
  scaleSelect.addEventListener('change', onScaleChange);
  
  // Circle of fifths checkbox
  fifthsCheckbox.addEventListener('change', (e) => {
    scaleVisualizer.setByFifths(e.target.checked);
  });
  
  // Chromatic colors checkbox
  chromaticColorsCheckbox.addEventListener('change', (e) => {
    scaleVisualizer.setChromaticColors(e.target.checked);
  });
  
  // Visualizer checkbox
  visualizerCheckbox.addEventListener('change', (e) => {
    soundVisualizer.setShow(e.target.checked);
  });
  
  // Progression controls
  progressionSelect.addEventListener('change', (e) => {
    stopProgressionPlayback();
    const chord = musicMaker.setProgression(e.target.value);
    updateProgressionDisplay(chord);
  });
  
  playProgBtn.addEventListener('click', () => {
    if (isProgressionPlaying) {
      stopProgressionPlayback();
    } else {
      startProgressionPlayback();
    }
  });
  
  speedSelect.addEventListener('change', () => {
    // If playing, restart with new speed
    if (isProgressionPlaying) {
      stopProgressionPlayback();
      startProgressionPlayback();
    }
  });
  
  // Help panel toggle
  helpBtn.addEventListener('click', () => {
    helpPanel.classList.remove('hidden');
    showHelpStatusBar();
  });
  
  closeHelpBtn.addEventListener('click', () => {
    helpPanel.classList.add('hidden');
    hideHelpStatusBar();
  });
  
  // Close help on background click
  helpPanel.addEventListener('click', (e) => {
    if (e.target === helpPanel) {
      helpPanel.classList.add('hidden');
      hideHelpStatusBar();
    }
  });
  
  // Set up sequence player UI references
  if (sequencePlayer) {
    sequencePlayer.setUIRefs({
      instrumentSelect,
      noteSelect,
      scaleSelect,
      fifthsCheckbox,
      chromaticColorsCheckbox
    });
  }
  
  // Demo link click handler
  setupDemoLinks();
  
  // Check for URL demo parameter
  checkURLDemo();
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
  
  // Update progression display if active (chords change with scale)
  if (musicMaker.currentProgression) {
    const chord = musicMaker.getCurrentProgressionChord();
    updateProgressionDisplay(chord);
  }
}


/**
 * Update progression display
 */
function updateProgressionDisplay(chord) {
  if (chord) {
    progressionDisplay.textContent = `${chord.step}/${chord.total}: ${chord.displayName}`;
    progressionControls.classList.remove('hidden');
  } else {
    progressionDisplay.textContent = '-';
    progressionControls.classList.add('hidden');
    stopProgressionPlayback();
  }
}

/**
 * Play current progression chord
 */
function playProgressionChord() {
  // Stop any currently playing notes
  const playing = musicMaker.getCurrentlyPlayingNotes();
  for (const note of Object.keys(playing)) {
    currentInstrument.stopNote(note);
    musicMaker.releasePlayingNote(note);
  }
  
  // Get and play the chord notes
  const notes = musicMaker.getCurrentProgressionNotes();
  for (const note of notes) {
    currentInstrument.playNote(note);
    musicMaker.addPlayingNote(note);
  }
  
  // Release after a portion of the interval (so chords don't overlap)
  const speed = parseInt(speedSelect.value);
  setTimeout(() => {
    for (const note of notes) {
      musicMaker.releasePlayingNote(note);
    }
  }, speed * 0.7);
}

/**
 * Start auto-playing the progression
 */
function startProgressionPlayback() {
  if (!musicMaker.currentProgression) return;
  
  isProgressionPlaying = true;
  playProgBtn.textContent = '⏹';
  playProgBtn.classList.add('playing');
  
  // Play first chord immediately
  playProgressionChord();
  updateProgressionDisplay(musicMaker.getCurrentProgressionChord());
  
  // Set up interval for subsequent chords
  const speed = parseInt(speedSelect.value);
  progressionInterval = setInterval(() => {
    const chord = musicMaker.nextProgressionStep();
    updateProgressionDisplay(chord);
    playProgressionChord();
  }, speed);
}

/**
 * Stop auto-playing the progression
 */
function stopProgressionPlayback() {
  isProgressionPlaying = false;
  playProgBtn.textContent = '▶';
  playProgBtn.classList.remove('playing');
  
  if (progressionInterval) {
    clearInterval(progressionInterval);
    progressionInterval = null;
  }
  
  // Stop any playing notes
  const playing = musicMaker.getCurrentlyPlayingNotes();
  for (const note of Object.keys(playing)) {
    currentInstrument.stopNote(note);
    musicMaker.releasePlayingNote(note);
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
  
  // Update status bar if help is visible
  if (isHelpVisible) {
    updateHelpStatusBar();
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
    
    // SoundVisualizer automatically uses ScaleVisualizer's dimensions
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
    hideHelpStatusBar();
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
 * Mouse moved handler - show note tooltip on hover
 */
function mouseMoved() {
  if (!isInitialized || !scaleVisualizer || !noteTooltip) return;
  
  // Check if mouse is on canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    hideNoteTooltip();
    return;
  }
  
  // Convert screen coordinates to WEBGL coordinates (centered at 0,0)
  const webglX = mouseX - width / 2;
  const webglY = mouseY - height / 2;
  
  const hoveredNote = scaleVisualizer.getNote(webglX, webglY);
  
  if (hoveredNote !== null) {
    if (hoveredNote !== lastHoveredNote) {
      lastHoveredNote = hoveredNote;
      showNoteTooltip(hoveredNote, mouseX, mouseY);
    } else {
      // Just update position
      updateTooltipPosition(mouseX, mouseY);
    }
  } else {
    hideNoteTooltip();
    lastHoveredNote = null;
  }
}

/**
 * Show tooltip for a note
 */
function showNoteTooltip(note, x, y) {
  const info = musicMaker.getNoteInfo(note);
  
  let html = `<div class="note-name">${info.displayName}</div>`;
  // html += `<div class="note-freq">${info.frequency.toFixed(1)} Hz</div>`;
  
  if (info.inScale) {
    html += `<div class="note-degree">Scale degree: ${info.scaleDegreeName}</div>`;
  } else {
    html += `<div class="not-in-scale">Not in current scale</div>`;
  }
  
  noteTooltip.innerHTML = html;
  noteTooltip.classList.remove('hidden');
  updateTooltipPosition(x, y);
}

/**
 * Update tooltip position
 */
function updateTooltipPosition(x, y) {
  // Position tooltip offset from cursor
  let tooltipX = x + 15;
  let tooltipY = y + 15;
  
  // Get canvas position
  const canvas = document.querySelector('canvas');
  const canvasRect = canvas.getBoundingClientRect();
  
  // Adjust position to be absolute
  tooltipX += canvasRect.left;
  tooltipY += canvasRect.top;
  
  // Keep tooltip on screen
  const tooltipRect = noteTooltip.getBoundingClientRect();
  if (tooltipX + tooltipRect.width > window.innerWidth - 10) {
    tooltipX = x - tooltipRect.width - 15 + canvasRect.left;
  }
  if (tooltipY + tooltipRect.height > window.innerHeight - 10) {
    tooltipY = y - tooltipRect.height - 15 + canvasRect.top;
  }
  
  noteTooltip.style.left = tooltipX + 'px';
  noteTooltip.style.top = tooltipY + 'px';
}

/**
 * Hide note tooltip
 */
function hideNoteTooltip() {
  if (noteTooltip) {
    noteTooltip.classList.add('hidden');
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

/**
 * Setup demo link click handlers
 */
function setupDemoLinks() {
  // Find all demo links in the document
  const demoLinks = document.querySelectorAll('.demo-link[data-sequence]');
  
  demoLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const sequenceStr = link.getAttribute('data-sequence');
      if (!sequenceStr || !sequencePlayer) return;
      
      // Stop any current progression playback
      stopProgressionPlayback();
      
      // Play the demo sequence
      await sequencePlayer.play(sequenceStr);
      
      // Update UI elements to reflect new configuration
      if (instrumentSelect && sequencePlayer.musicMaker) {
        // UI is already updated by sequencePlayer.applyConfig via uiRefs
      }
    });
  });
}

/**
 * Check URL for demo parameter and play if found
 */
function checkURLDemo() {
  const sequence = SequencePlayer.fromURL(window.location.search);
  
  if (sequence && sequencePlayer) {
    // Wait a moment for sounds to load, then play
    const checkReady = setInterval(() => {
      if (isInitialized) {
        clearInterval(checkReady);
        sequencePlayer.play(sequence);
      }
    }, 100);
    
    // Give up after 10 seconds
    setTimeout(() => clearInterval(checkReady), 10000);
  }
}

/**
 * Show the help status bar and start updating it
 */
function showHelpStatusBar() {
  isHelpVisible = true;
  if (helpStatusBar) {
    helpStatusBar.classList.add('visible');
    updateHelpStatusBar();
  }
}

/**
 * Hide the help status bar
 */
function hideHelpStatusBar() {
  isHelpVisible = false;
  if (helpStatusBar) {
    helpStatusBar.classList.remove('visible');
  }
}

/**
 * Update the help status bar with current config and chord info
 */
function updateHelpStatusBar() {
  if (!helpStatusBar || !isHelpVisible || !musicMaker) return;
  
  // Get current configuration
  const temperament = currentInstrument ? currentInstrument.getName() : 'Equal Tempered';
  const root = musicMaker.getCurrentRoot();
  const scale = musicMaker.getCurrentScaleType();
  
  const configEl = helpStatusBar.querySelector('.status-config');
  if (configEl) {
    configEl.textContent = `${temperament} | ${root} ${scale}`;
  }
  
  // Get currently playing chord info
  const chordEl = helpStatusBar.querySelector('.status-chord');
  if (chordEl) {
    const playingNotes = musicMaker.getCurrentlyPlayingNotes();
    const noteNames = Object.keys(playingNotes);
    
    if (noteNames.length === 0) {
      chordEl.textContent = 'No notes playing';
    } else {
      // Get detected chords
      const chords = musicMaker.getCurrentlyPlayingChordsFromNotes(playingNotes);
      const chordNames = Object.keys(chords).filter(c => !c.endsWith('f')); // Filter out fifths
      
      if (chordNames.length > 0) {
        chordEl.textContent = `${chordNames[0]} (${noteNames.join(', ')})`;
      } else {
        chordEl.textContent = noteNames.join(', ');
      }
    }
  }
}
