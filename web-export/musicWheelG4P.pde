// Need G4P library
import g4p_controls.*;
import java.util.*;

Instrument currentInstrument;
MusicMaker musicMaker;
SoundMaker soundMaker;
ScaleVisualizer scaleVisualizer;

// todo: add help text/button
public void setup(){
  size(600, 400, JAVA2D);
  strokeWeight(1.5);
  background(0,0,0);
  // Place your setup code here
  soundMaker = new SoundMaker(this);
  musicMaker = new MusicMaker();
  currentInstrument = new Instrument("Grand Piano", this, soundMaker, musicMaker);
  scaleVisualizer = new ScaleVisualizer(musicMaker, currentInstrument);
  
  createGUI();
  customGUI();
}

// Given an instrument, rootnote, and scale type (strings),
// sets the current instrument and scale object
public void setInstrumentScale(String instrumentName, String rootNote, String scaleType) {
  currentInstrument = new Instrument(instrumentName, this, soundMaker, musicMaker);
  musicMaker.setScale(rootNote, scaleType);
  scaleVisualizer.setCurrentInstrument(currentInstrument);
  println("Changed to " + rootNote + " " + scaleType + " on " + instrumentName);
}

public void setVisByFifths(boolean toset) {
  scaleVisualizer.setByFifths(toset);
}

void keyPressed() {
  String note = "";
  if(key == 'q') {note = musicMaker.getNoteNameFromNumberInCurrentScale(1); }
  else if(key == 'w') {note = musicMaker.getNoteNameFromNumberInCurrentScale(2); }
  else if(key == 'e') {note = musicMaker.getNoteNameFromNumberInCurrentScale(3); }
  else if(key == 'r') {note = musicMaker.getNoteNameFromNumberInCurrentScale(4); }
  else if(key == 't') {note = musicMaker.getNoteNameFromNumberInCurrentScale(5); }
  else if(key == 'y') {note = musicMaker.getNoteNameFromNumberInCurrentScale(6); }
  else if(key == 'u') {note = musicMaker.getNoteNameFromNumberInCurrentScale(7); }
  else if(key == 'i') {note = musicMaker.getNoteNameFromNumberInCurrentScale(8); }
  else if(key == 'o') {note = musicMaker.getNoteNameFromNumberInCurrentScale(9); }
  else if(key == 'p') {note = musicMaker.getNoteNameFromNumberInCurrentScale(10); }
  else if(key == '[') {note = musicMaker.getNoteNameFromNumberInCurrentScale(11); }
  else if(key == ']') {note = musicMaker.getNoteNameFromNumberInCurrentScale(12); }
  else if(key == '\\') {note = musicMaker.getNoteNameFromNumberInCurrentScale(13); }

  else if(key == '1') {note = musicMaker.getNoteNameFromNumRelativeToRoot(0); }
  else if(key == '2') {note = musicMaker.getNoteNameFromNumRelativeToRoot(1); }
  else if(key == '3') {note = musicMaker.getNoteNameFromNumRelativeToRoot(2); }
  else if(key == '4') {note = musicMaker.getNoteNameFromNumRelativeToRoot(3); }
  else if(key == '5') {note = musicMaker.getNoteNameFromNumRelativeToRoot(4); }
  else if(key == '6') {note = musicMaker.getNoteNameFromNumRelativeToRoot(5); }
  else if(key == '7') {note = musicMaker.getNoteNameFromNumRelativeToRoot(6); }
  else if(key == '8') {note = musicMaker.getNoteNameFromNumRelativeToRoot(7); }
  else if(key == '9') {note = musicMaker.getNoteNameFromNumRelativeToRoot(8); }
  else if(key == '0') {note = musicMaker.getNoteNameFromNumRelativeToRoot(9); }
  else if(key == '-') {note = musicMaker.getNoteNameFromNumRelativeToRoot(10); }
  else if(key == '=') {note = musicMaker.getNoteNameFromNumRelativeToRoot(11); }
  // if there is something in "played"
  if(!(note.compareTo("") == 0)) {
    if(!musicMaker.isNotePlaying(note)) {
      currentInstrument.playNote(note);
    }
    musicMaker.addPlayingNote(note);
  }
}

void keyReleased() {
  String note = "";
  if(key == 'q') {note = musicMaker.getNoteNameFromNumberInCurrentScale(1); }
  else if(key == 'w') {note = musicMaker.getNoteNameFromNumberInCurrentScale(2); }
  else if(key == 'e') {note = musicMaker.getNoteNameFromNumberInCurrentScale(3); }
  else if(key == 'r') {note = musicMaker.getNoteNameFromNumberInCurrentScale(4); }
  else if(key == 't') {note = musicMaker.getNoteNameFromNumberInCurrentScale(5); }
  else if(key == 'y') {note = musicMaker.getNoteNameFromNumberInCurrentScale(6); }
  else if(key == 'u') {note = musicMaker.getNoteNameFromNumberInCurrentScale(7); }
  else if(key == 'i') {note = musicMaker.getNoteNameFromNumberInCurrentScale(8); }
  else if(key == 'o') {note = musicMaker.getNoteNameFromNumberInCurrentScale(9); }
  else if(key == 'p') {note = musicMaker.getNoteNameFromNumberInCurrentScale(10); }
  else if(key == '[') {note = musicMaker.getNoteNameFromNumberInCurrentScale(11); }
  else if(key == ']') {note = musicMaker.getNoteNameFromNumberInCurrentScale(12); }
  else if(key == '\\') {note = musicMaker.getNoteNameFromNumberInCurrentScale(13); }
  
  else if(key == '1') {note = musicMaker.getNoteNameFromNumRelativeToRoot(0); }
  else if(key == '2') {note = musicMaker.getNoteNameFromNumRelativeToRoot(1); }
  else if(key == '3') {note = musicMaker.getNoteNameFromNumRelativeToRoot(2); }
  else if(key == '4') {note = musicMaker.getNoteNameFromNumRelativeToRoot(3); }
  else if(key == '5') {note = musicMaker.getNoteNameFromNumRelativeToRoot(4); }
  else if(key == '6') {note = musicMaker.getNoteNameFromNumRelativeToRoot(5); }
  else if(key == '7') {note = musicMaker.getNoteNameFromNumRelativeToRoot(6); }
  else if(key == '8') {note = musicMaker.getNoteNameFromNumRelativeToRoot(7); }
  else if(key == '9') {note = musicMaker.getNoteNameFromNumRelativeToRoot(8); }
  else if(key == '0') {note = musicMaker.getNoteNameFromNumRelativeToRoot(9); }
  else if(key == '-') {note = musicMaker.getNoteNameFromNumRelativeToRoot(10); }
  else if(key == '=') {note = musicMaker.getNoteNameFromNumRelativeToRoot(11); }
  // if there is something in "played"
  if(!(note.compareTo("") == 0)) {
    if(musicMaker.isNotePlaying(note)) {
      currentInstrument.stopNote(note);
    }
    musicMaker.releasePlayingNote(note);
  }
}

public void mousePressed() {
  String notePoked = scaleVisualizer.getNote(mouseX, mouseY);
  if(notePoked != null) {
    if(musicMaker.isNotePlaying(notePoked)) {
      currentInstrument.stopNote(notePoked);
      musicMaker.releasePlayingNote(notePoked);
     }
    else if(!musicMaker.isNotePlaying(notePoked)) {
      currentInstrument.playNote(notePoked);
      musicMaker.addPlayingNote(notePoked);
    }
  }
}

public void draw(){
  background(0);
  scaleVisualizer.draw();
  /*HashMap<Float, Float> pitches = soundMaker.getCurrentPitches();
  for(Float pitch: pitches.keySet()) {
   Float amp = pitches.get(pitch);
   println(pitch + " -> " + amp); 
  }*/
}

// Use this method to add additional statements
// to customise the GUI controls
public void customGUI(){
  helpPanel.setLocalColorScheme(GCScheme.SCHEME_12);
  byFifthsCheckbox.setLocalColorScheme(GCScheme.SCHEME_12);
  updateButton.setLocalColorScheme(GCScheme.SCHEME_12);
  instrumentDroplist.setLocalColorScheme(GCScheme.SCHEME_12);
  noteDroplist.setLocalColorScheme(GCScheme.SCHEME_12);
  scaleDroplist.setLocalColorScheme(GCScheme.SCHEME_12);
  textarea2.setLocalColorScheme(GCScheme.SCHEME_12);
  playHighlightedNotes.setLocalColorScheme(GCScheme.SCHEME_12);
}
class Instrument {
  String name;
  //ArrayList<Note> notes;
  PApplet mainObj;
  SoundMaker soundMaker;
  MusicMaker musicMaker;

  // needs the name object to pass to the note objects
  // An instrument is basically a collection of notes,
  // which hold sounds (mp3) and has a name. 
  // By convention, note 0 is A...
  // todo: add more instruments!
  Instrument(String theName, PApplet theMainObj, SoundMaker theSoundMaker, MusicMaker theMusicMaker) {
    soundMaker = theSoundMaker;
    mainObj = theMainObj;
    name = theName;
    musicMaker = theMusicMaker;
  } 
  
  void playNote(String noteName) {
   String filebase = this.name + noteName; 
   soundMaker.playSound(filebase);
  }
  
  void stopNote(String noteName) {
   String filebase = this.name + noteName; 
   soundMaker.stopSound(filebase);
  }
  
  String getName() {
   return name; 
  }
  
  // returns a hashmap of note names if they are playing... 
  // (based on what the soundmaker reports for playing sounds)
  /*HashMap<String,Integer> getCurrentlyPlayingNotes() {
    HashMap<String,Integer> retMap = new HashMap<String,Integer>();
    for(String soundName : soundMaker.getPlayingSounds().keySet()) {
      String noteName = soundName.replaceFirst(name,"");
      noteName = noteName.replaceFirst(".mp3","");
      retMap.put(noteName,1);
    }
    return retMap;
  }*/
  
}

import java.util.*;

// A MusicMaker holds musical information; eg.
// the patterns for "Major" and "Minor" and the
// mapping from note names to their indices (A is 0, etc).
// It will also keep track of what the current pattern and root note are, 
// and so can answer questions about notes relative to that, etc
class MusicMaker {
  // eg maps "Major" to 0,2,4,5,7,9,11
  HashMap<String, ArrayList<Integer>> scaleTypesToPatterns;
  // eg A -> 0, A# -> 1, etc
  HashMap<String, Integer> notesToNumbers; 
  // eg 0 -> A, 1 -> A#, etc
  HashMap<Integer, String> numbersToNotes;
  // eg. "" (major) -> 0,4,7 (major third, minor third), "m" (minor) -> 0,3,7 (minor third, major third)
  // "dim" -> 0,3,6 (minor third, minor third) "aug" -> 0,4,8 (major third, major third)
  HashMap<String, ArrayList<Integer>> chordTypesToNoteLists;
  ArrayList<Integer> currentPattern;
  HashMap<String, String> fifths;
  HashMap<String, Integer> currentScaleNotes;
  String currentRoot;
  String currentScaleType;

  HashMap<String, Integer> currentlyPlayingNotes;


  MusicMaker() {
    setupNotesToNumbers();
    setupFifths();
    setupNumbersToNotes();
    setupScaleTypesToPatterns();
    setupChordsToNoteLists();
    setScale("C", "Major");
    currentlyPlayingNotes = new HashMap<String, Integer>();
  }

  String getFifth(String note) {
    return(fifths.get(note)); 
  }

  String getCurrentScaleName() {
   return currentRoot + " " + currentScaleType; 
  }

  String getCurrentRoot() {
    return currentRoot;
  }

  HashMap<String, Integer> getCurrentlyPlayingNotes() {
    return currentlyPlayingNotes;
  }

  void addPlayingNote(String noteName) {
    currentlyPlayingNotes.put(noteName, 1);
  }

  void releasePlayingNote(String noteName) {
    if (currentlyPlayingNotes.containsKey(noteName)) {
      currentlyPlayingNotes.remove(noteName);
    }
  }

  boolean isNoteInCurrentScale(String theNote) {
    if (currentScaleNotes.containsKey(theNote)) {
      return true;
    }
    return false;
  }

  void setScale(String root, String type) {
    currentRoot = root;
    currentScaleType = type;
    currentPattern = scaleTypesToPatterns.get(currentScaleType);
    currentScaleNotes = new HashMap<String, Integer>();
    for (int i = 1; i <= currentPattern.size(); i++) {
      String name = getNoteNameFromNumberInCurrentScale(i);
      currentScaleNotes.put(name, 1);
    }
  }
  
  String getNoteNameFromNumRelativeToRoot(int theNum) {
    int rootNum = getNumFromNoteName(currentRoot);
    int playNum = (rootNum + theNum)%12;
    return getNoteNameFromNum(playNum);
  }
  
  boolean isNotePlaying(String name) {
    if(currentlyPlayingNotes.containsKey(name)) {
      return true;
    }
   return false; 
  }

  // given a number, returns that note relative to the root note, from the pattern. 
  // For example, if our root is C (note 3) in C major, and we want to play note 5 from
  // the scale (G), then we want the 3 + the 5th (at index 4...) in the pattern (0,2,4,5,_7_,9,11), MOD the
  // size of the pattern, mod the size of the note collection. whew.
  String getNoteNameFromNumberInCurrentScale(int theNum) {
    int rootNum = getNumFromNoteName(currentRoot);
    int patternindex = theNum - 1;
    patternindex = patternindex%(currentPattern.size());
    int patternnum = currentPattern.get(patternindex);
    int notenum = (rootNum + patternnum)%12;
    String noteName = getNoteNameFromNum(notenum);
    return noteName;
  }

  String getCurrentRelative() {
     String toRet = "";
     if(!currentScaleType.matches("Major.*")) {
       toRet = getNoteNameFromNum((getNumFromNoteName(currentRoot) + 3)%12);
     } 
     else {
       toRet = getNoteNameFromNum((getNumFromNoteName(currentRoot) - 3+12)%12);
     }
     return toRet;
  }

  void setupFifths() {
    fifths = new HashMap<String, String>();
    fifths.put("C", "E"); 
    fifths.put("C#", "F"); 
    fifths.put("D", "F#"); 
    fifths.put("D#", "G"); 
    fifths.put("E", "G#"); 
    fifths.put("F", "A"); 
    fifths.put("F#", "A#"); 
    fifths.put("G", "B"); 
    fifths.put("G#", "C"); 
    fifths.put("A", "C#"); 
    fifths.put("A#", "D"); 
    fifths.put("B", "D#");
  }

  void setupChordsToNoteLists() {
    // todo: add more chord types
    chordTypesToNoteLists = new HashMap<String, ArrayList<Integer>>(); 
    chordTypesToNoteLists.put("", new ArrayList<Integer>(Arrays.asList(0, 4, 7)));
    chordTypesToNoteLists.put("7", new ArrayList<Integer>(Arrays.asList(0, 4, 7, 10)));
    chordTypesToNoteLists.put("M7", new ArrayList<Integer>(Arrays.asList(0, 4, 7, 11)));
    chordTypesToNoteLists.put("m", new ArrayList<Integer>(Arrays.asList(0, 3, 7)));
    chordTypesToNoteLists.put("f", new ArrayList<Integer>(Arrays.asList(0, 7)));
    chordTypesToNoteLists.put("dim", new ArrayList<Integer>(Arrays.asList(0, 3, 6)));
    chordTypesToNoteLists.put("aug", new ArrayList<Integer>(Arrays.asList(0, 4, 8)));
  }

  // runtime: num notes playing * num chord types defined * length of chord type patterns
  HashMap<String, ArrayList<String>> getCurrentlyPlayingChordsFromNotes(HashMap<String, Integer> currentNotes) {
    HashMap<String, ArrayList<String>> retMap = new HashMap<String, ArrayList<String>>();
    for (String potentialRoot : currentNotes.keySet()) {
      int potentialRootNum = this.getNumFromNoteName(potentialRoot);
      for (String potentialChordType : chordTypesToNoteLists.keySet()) {
        String potentialChord = potentialRoot + potentialChordType;
        ArrayList<String> potentialChordNotes = new ArrayList<String>();
        ArrayList<Integer> potentialChordPattern = chordTypesToNoteLists.get(potentialChordType);
        boolean isChordType = true;
        for (Integer relNoteNeededNum : potentialChordPattern) {
          int absNoteNeededNum = (potentialRootNum + relNoteNeededNum)%this.notesToNumbers.size();
          String absNoteNeeded = this.getNoteNameFromNum(absNoteNeededNum);
          potentialChordNotes.add(absNoteNeeded);
          if (!currentNotes.containsKey(absNoteNeeded)) {
            isChordType = false;
          }
        }
        if (isChordType) {
          retMap.put(potentialChord, potentialChordNotes);
        }
      }
    }

    return retMap;
  }


  /*HashMap<String,Integer> getCurrentlyPlayingChordsFromNotes(HashMap<String,Integer> currentNotes) {
   HashMap<String,Integer> retMap = new HashMap<String,Integer>();
   for(String chordName : chordsToNoteLists.keySet()) {
   ArrayList<String> chordNotes = chordsToNoteLists.get(chordName);
   boolean hasChord = true;
   for(String chordNote : chordNotes) {
   if(!currentNotes.containsKey(chordNote)) {hasChord = false;} 
   }
   if(hasChord) {retMap.put(chordName,1);} 
   }
   return retMap;
   }*/

  void setupNotesToNumbers() {
    notesToNumbers = new HashMap<String, Integer>();
    notesToNumbers.put("A", 0); 
    notesToNumbers.put("A#", 1); 
    notesToNumbers.put("B", 2); 
    notesToNumbers.put("C", 3); 
    notesToNumbers.put("C#", 4); 
    notesToNumbers.put("D", 5); 
    notesToNumbers.put("D#", 6); 
    notesToNumbers.put("E", 7); 
    notesToNumbers.put("F", 8); 
    notesToNumbers.put("F#", 9); 
    notesToNumbers.put("G", 10); 
    notesToNumbers.put("G#", 11);
  }

  void setupNumbersToNotes() {
    numbersToNotes = new HashMap<Integer, String>();
    numbersToNotes.put(0, "A"); 
    numbersToNotes.put(1, "A#"); 
    numbersToNotes.put(2, "B"); 
    numbersToNotes.put(3, "C"); 
    numbersToNotes.put(4, "C#"); 
    numbersToNotes.put(5, "D"); 
    numbersToNotes.put(6, "D#"); 
    numbersToNotes.put(7, "E"); 
    numbersToNotes.put(8, "F"); 
    numbersToNotes.put(9, "F#"); 
    numbersToNotes.put(10, "G"); 
    numbersToNotes.put(11, "G#");
  }

  String getNoteNameFromNum(int thenum) {
    String name = numbersToNotes.get(thenum);
    return name;
  }

  int getNumFromNoteName(String name) {
    int num = notesToNumbers.get(name);
    return num;
  }

  void setupScaleTypesToPatterns() {
    scaleTypesToPatterns = new HashMap<String, ArrayList<Integer>>();
    // todo: add pentatonic scales
    scaleTypesToPatterns.put("Major", new ArrayList<Integer>(Arrays.asList(0, 2, 4, 5, 7, 9, 11)));
    scaleTypesToPatterns.put("Minor", new ArrayList<Integer>(Arrays.asList(0, 2, 3, 5, 7, 8, 10)));
    scaleTypesToPatterns.put("Minor Pent.", new ArrayList<Integer>(Arrays.asList(0, 3, 5, 7, 10)));
    scaleTypesToPatterns.put("Major Pent.", new ArrayList<Integer>(Arrays.asList(0, 2, 4, 7, 9)));
    scaleTypesToPatterns.put("Blues", new ArrayList<Integer>(Arrays.asList(0, 3, 5, 6, 7, 10)));
  }
}

// mostly for drawing purposes 
class ScaleVisualizer {
  float centerx, centery;
  float radius, noteCircumference;
  MusicMaker musicMaker;
  Instrument currentInstrument;
  HashMap<String, Integer> noteColors;
  HashMap<String, Float> noteAlphas;
  boolean byFifths;
  // for now A->0, A# -> 1, but perhaps later we can rearrange things to have a circle of fifths...
  HashMap<String, Float> noteLocations, chromaticLocations, fifthLocations;
  int minAlpha;


  //todo: add some sort of base waveform visualizer?
  ScaleVisualizer(MusicMaker theMusicMaker, Instrument theCurrentInstrument) {
    byFifths = false;
    setupNoteColorsAlphas();
    musicMaker = theMusicMaker;
    minAlpha = 30;
    currentInstrument = theCurrentInstrument;
    centerx = width/2 - 100;
    centery = height/2;
    noteCircumference = 30;
    radius = min(width/2, height/2) - 90;
  }

  String getNote(int x, int y) {
    String toRet = null;
    for (String note : noteLocations.keySet()) {
      float noteLoc = noteLocations.get(note);
      float xloc = centerx + radius*cos(radians((noteLoc)*30-90));
      float yloc = centery + radius*sin(radians((noteLoc)*30-90));
      double pokeDistance = Math.sqrt((x-xloc)*(x-xloc) + (y - yloc)*(y - yloc));
      if (pokeDistance < noteCircumference/2) {
        toRet = note;
      }
    }
    return toRet;
  }

  // get's the note locations one step closer to correct
  // according to the status of the byFifths variable
  boolean updateNoteLocationsByFifthsAndRoot() {
    boolean changed = false;
    for (String note : noteLocations.keySet()) {
      float currentPos = noteLocations.get(note);
      float correctPos = chromaticLocations.get(note);
      String currentRoot = musicMaker.getCurrentRoot();
      float currentRootAsNumLoc = chromaticLocations.get(currentRoot);

      if (byFifths) {
        correctPos = fifthLocations.get(note);
        currentRootAsNumLoc = fifthLocations.get(currentRoot);
      }

      correctPos = correctPos - currentRootAsNumLoc;
      if (correctPos >= 12.0) {
        correctPos = correctPos - 12.0;
      } 
      else if (correctPos < 0.0) {
        correctPos = correctPos + 12.0;
      }
      //println("note: " + note + " currentpos: " + currentPos + " correct: " + correctPos);
      // rotate into place, either left or right based on where the current root is; 
      // note that 0.0 and 12.0 are "equal"..
      println("current root: " + currentRoot + " rel: " + musicMaker.getCurrentRelative());
      float relativePos = noteLocations.get(musicMaker.getCurrentRelative());
      float rootPos = noteLocations.get(currentRoot);
      if(abs(correctPos - currentPos) >= 0.06) {
        if (rootPos <= 6.0) {
          currentPos = currentPos - 0.05;
        }
        else {
          currentPos = currentPos + 0.05;
        }
        changed = true;
      }
      else {
       // round to nearest int once it's close enough
        currentPos = int(currentPos + 0.5)+0.0; 
      }
      // make sure we stay in [0,12]
      if (currentPos >= 12.0) {
        currentPos = currentPos - 12.0;
      } 
      else if (currentPos < 0) {
        currentPos = currentPos + 12.0;
      }
      noteLocations.put(note, currentPos);
    }
    return changed;
  }

  // get's the note alphas one step closer to correct according
  // to the current scale
  boolean updateNoteAlphasByCurrentScale() {
    boolean change = false;
    for (String noteName : noteAlphas.keySet()) {
      int newval = 0;
      if (musicMaker.isNoteInCurrentScale(noteName)) {
        newval = 100;
      }
      else {
        newval = minAlpha;
      }
      float oldval = noteAlphas.get(noteName);
      if (abs(newval - oldval) > 0.5) {
        noteAlphas.put(noteName, (newval+oldval*8)/9.0);
        change = true;
      }
    }
    return change;
  }

  void setCurrentInstrument(Instrument newInstrument) {
    currentInstrument = newInstrument;
  }

  void setByFifths(boolean toSet) {
    byFifths = toSet;
  }

  void draw() {
    //println(frameRate);
    drawOverallInfo();

    // First we'll make sure the correct notes are being shown,
    // then we'll be sure the correct order is shown
    // then we'll rotate.
    boolean updated = updateNoteAlphasByCurrentScale();
    if (!updated) {
      updated = updateNoteLocationsByFifthsAndRoot();
    }

    drawChords();
    drawNotes();
  }

  void drawOverallInfo() {
    colorMode(RGB, 255, 255, 255, 100);
    fill(200, 200, 200, 100);
    textSize(16);
    textAlign(LEFT, TOP);
    text(currentInstrument.getName(), 20, 10);
    text(musicMaker.getCurrentScaleName(), 20, 28);
    text("1 through = : All Notes", width - 210, height - 43);
    text("q through ] : Scale Notes", width - 210, height - 25);
    textAlign(CENTER, TOP);
    text("Root", centerx, centery - (radius + 50));
  }

  void drawNotes() {
    textSize(16);
    textAlign(CENTER, CENTER);
    for (String noteName : noteLocations.keySet()) {
      drawNote(noteName);
    }
  }

  void drawChords() {
    HashMap<String, ArrayList<String>> chords = musicMaker.getCurrentlyPlayingChordsFromNotes(musicMaker.getCurrentlyPlayingNotes()); 
    for (String chord : chords.keySet()) {
      drawChord(chord, chords.get(chord));
    }
  }

  void drawChord(String chordName, ArrayList<String> notes) { 
    strokeWeight(0);
    colorMode(HSB, 360, 255, 255, 100);
    beginShape();
    boolean root = true;
    float rootxloc = 0;
    float rootyloc = 0;
    int rootColor = 0;
    for (String note : notes) {
      fill(noteColors.get(note), noteAlphas.get(note)*0.5);
      float noteLoc = noteLocations.get(note);
      if (root) {
        //rootxloc = rootxloc + (3.0/(notes.size()+2))*(centerx + radius*0.7*cos(radians((noteLoc)*30-90)));
        //rootyloc = rootyloc + (3.0/(notes.size()+2))*(centery + radius*0.7*sin(radians((noteLoc)*30-90)));
        rootColor = noteColors.get(note);
        rootxloc = rootxloc + (1.0/(notes.size()))*(centerx + radius*1.3*cos(radians((noteLoc)*30-90)));
        rootyloc = rootyloc + (1.0/(notes.size()))*(centery + radius*1.3*sin(radians((noteLoc)*30-90)));
      }
      else {
        //rootxloc = rootxloc + (1.0/(notes.size()+2))*(centerx + radius*0.7*cos(radians((noteLoc)*30-90)));
        //rootyloc = rootyloc + (1.0/(notes.size()+2))*(centery + radius*0.7*sin(radians((noteLoc)*30-90)));
        rootxloc = rootxloc + (1.0/(notes.size()))*(centerx + radius*1.0*cos(radians((noteLoc)*30-90)));
        rootyloc = rootyloc + (1.0/(notes.size()))*(centery + radius*1.0*sin(radians((noteLoc)*30-90)));
      }
      // We'll add two vertices per note so we can draw single "lines" as chords
      float xloc = centerx + radius*cos(radians((noteLoc)*30-90));
      float yloc = centery + radius*sin(radians((noteLoc)*30-90));     
      float xloc2 = centerx + radius*cos(radians((noteLoc)*30-88));
      float yloc2 = centery + radius*sin(radians((noteLoc)*30-88));
      vertex(xloc, yloc);
      vertex(xloc2, yloc2);
      root = false;
    }
    endShape(CLOSE);
    fill(0, 0, 255, 100);
    textSize(16);
    textAlign(CENTER, CENTER);
    // don't draw names for "fifth" chords
    if (!chordName.matches(".*f")) {
      if(notes.size() >= 4) {fill(0,0,255,100);}
      else {fill(rootColor);}
      
      text(chordName, rootxloc, rootyloc-4);
      //ellipse(rootxloc, rootyloc, 3,3);
    }
  }

  void drawNote(String noteName) {
    float noteLoc = noteLocations.get(noteName);
    float xloc = centerx + radius*cos(radians((noteLoc)*30-90));
    float yloc = centery + radius*sin(radians((noteLoc)*30-90));
    fill(0, 0, 0);
    if (musicMaker.isNotePlaying(noteName)) {
      strokeWeight(4);
      stroke(noteColors.get(noteName));
    }
    else {
      strokeWeight(1.5);
      stroke(100, 100, 100, noteAlphas.get(noteName));
    }
    ellipse(xloc, yloc, noteCircumference, noteCircumference);
    fill(noteColors.get(noteName), noteAlphas.get(noteName));
    text(noteName, xloc, yloc-2.5);
  }

  void setupNoteColorsAlphas() {
    colorMode(HSB, 360, 255, 255, 100);
    noteColors = new HashMap<String, Integer>();
    noteColors.put("C", color(0*30, 155, 255)); 
    noteColors.put("C#", color(7*30, 155, 255)); 
    noteColors.put("D", color(2*30, 155, 255)); 
    noteColors.put("D#", color(9*30, 155, 255)); 
    noteColors.put("E", color(4*30, 155, 255)); 
    noteColors.put("F", color(11*30, 155, 255)); 
    noteColors.put("F#", color(6*30, 155, 255)); 
    noteColors.put("G", color(1*30, 155, 255)); 
    noteColors.put("G#", color(8*30, 155, 255)); 
    noteColors.put("A", color(3*30, 155, 255)); 
    noteColors.put("A#", color(10*30, 155, 255)); 
    noteColors.put("B", color(5*30, 155, 255)); 
    colorMode(RGB, 255, 255, 255, 100);

    noteAlphas = new HashMap<String, Float>();
    noteAlphas.put("C", 100.0);
    noteAlphas.put("C#", 100.0);
    noteAlphas.put("D", 100.0);
    noteAlphas.put("D#", 100.0);
    noteAlphas.put("E", 100.0);
    noteAlphas.put("F", 100.0);
    noteAlphas.put("F#", 100.0);
    noteAlphas.put("G", 100.0);
    noteAlphas.put("G#", 100.0);
    noteAlphas.put("A", 100.0);
    noteAlphas.put("A#", 100.0);
    noteAlphas.put("B", 100.0);

    // we'll start in C major ;)
    noteLocations = new HashMap<String, Float>();
    noteLocations.put("A", 9.0);
    noteLocations.put("A#", 10.0);
    noteLocations.put("B", 11.0);
    noteLocations.put("C", 0.0);
    noteLocations.put("C#", 1.0);
    noteLocations.put("D", 2.0);
    noteLocations.put("D#", 3.0);
    noteLocations.put("E", 4.0);
    noteLocations.put("F", 5.0);
    noteLocations.put("F#", 6.0);
    noteLocations.put("G", 7.0);
    noteLocations.put("G#", 8.0);

    // circle of fifths...
    chromaticLocations = new HashMap<String, Float>();
    chromaticLocations.put("A", 0.0);
    chromaticLocations.put("A#", 1.0);
    chromaticLocations.put("B", 2.0);
    chromaticLocations.put("C", 3.0);
    chromaticLocations.put("C#", 4.0);
    chromaticLocations.put("D", 5.0);
    chromaticLocations.put("D#", 6.0);
    chromaticLocations.put("E", 7.0);
    chromaticLocations.put("F", 8.0);
    chromaticLocations.put("F#", 9.0);
    chromaticLocations.put("G", 10.0);
    chromaticLocations.put("G#", 11.0);

    fifthLocations = new HashMap<String, Float>();
    fifthLocations.put("A", 0.0);
    fifthLocations.put("E", 1.0);
    fifthLocations.put("B", 2.0);
    fifthLocations.put("F#", 3.0);
    fifthLocations.put("C#", 4.0);
    fifthLocations.put("G#", 5.0);
    fifthLocations.put("D#", 6.0);
    fifthLocations.put("A#", 7.0);
    fifthLocations.put("F", 8.0);
    fifthLocations.put("C", 9.0);
    fifthLocations.put("G", 10.0);
    fifthLocations.put("D", 11.0);
  }
}

import ddf.minim.spi.*;
import ddf.minim.signals.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.ugens.*;
import ddf.minim.effects.*;
import java.util.*;

class SoundMaker {
  HashMap<String, AudioSample> filesToSounds;
  FFT fft;
  Minim minim;
  java.io.File folder;
  java.io.FilenameFilter jpgFilter;

  SoundMaker(PApplet mainobj) {
    filesToSounds = new HashMap<String, AudioSample>();
    folder = new java.io.File(dataPath(""));
    jpgFilter = new java.io.FilenameFilter() {
      boolean accept(File dir, String name) {
        return name.toLowerCase().endsWith(".mp3");
      }
    };
    minim = new Minim(mainobj);
    java.io.File folder = new java.io.File(dataPath(""));
    String[] filenames = folder.list(jpgFilter);

    for (int i = 0; i < filenames.length; i++) {
      AudioSample sound = minim.loadSample(filenames[i]);
      // we'll use a single fft object for all the sounds...
      fft = new FFT(sound.bufferSize(), sound.sampleRate());
      filesToSounds.put(filenames[i], sound);
    }
  }

  // retuns a hashmap containing sound filenames (minus the .mp3) mapped to 1's
  /*HashMap<String, Integer> getPlayingSounds() {
    HashMap<String, Integer> retMap = new HashMap<String, Integer>();
    for (String name : filesToSounds.keySet()) {
      AudioSample player = filesToSounds.get(name);
      if (player.position() < 500 && player.isPlaying()) {
        retMap.put(name, 1);
      }
    }
    return retMap;
  }*/
  
  // retuns a hashmap containing sound filenames (minus the .mp3) mapped to the pitches being played
  /*HashMap<Float, Float> getCurrentPitches() {
    HashMap<Float, Float> retMap = new HashMap<Float, Float>();
    for (String name : filesToSounds.keySet()) {
      AudioSample player = filesToSounds.get(name);
      
      if (player.position() < 1000 && player.isPlaying()) {
        fft = new FFT(player.bufferSize(), player.sampleRate());
        fft.forward(player.mix);
        retMap.put(fft.indexToFreq(1), 1.0);
      }
    }
    return retMap;
  }*/

  void playSound(String basename) {
    AudioSample player = filesToSounds.get(basename + ".mp3");
    //player.rewind();
    player.setGain(0.0);
    player.trigger();
  }
  
  void stopSound(String basename) {
   /* AudioSample player = filesToSounds.get(basename + ".mp3");
    //player.shiftGain(0.0,-60.0, 1000);
    for(int i = 0; i > -60; i--) {
     player.setGain(i); 
     delay(10);
    }*/
    //player.rewind();
  }
}

/* =========================================================
 * ====                   WARNING                        ===
 * =========================================================
 * The code in this tab has been generated from the GUI form
 * designer and care should be taken when editing this file.
 * Only add/edit code inside the event handlers i.e. only
 * use lines between the matching comment tags. e.g.

 void myBtnEvents(GButton button) { //_CODE_:button1:12356:
     // It is safe to enter your event code here  
 } //_CODE_:button1:12356:
 
 * Do not rename this tab!
 * =========================================================
 */

public void scaleDroplist_click1(GDropList source, GEvent event) { //_CODE_:scaleDroplist:707967:
  println("scaleDroplist - GDropList event occured " + System.currentTimeMillis()%10000000 );
  //setInstrumentScale(instrumentDroplist.getSelectedText(), noteDroplist.getSelectedText(), scaleDroplist.getSelectedText()); 

} //_CODE_:scaleDroplist:707967:

public void noteDroplist_click1(GDropList source, GEvent event) { //_CODE_:noteDroplist:670313:
  println("noteDroplist - GDropList event occured " + System.currentTimeMillis()%10000000 );
  //setInstrumentScale(instrumentDroplist.getSelectedText(), noteDroplist.getSelectedText(), scaleDroplist.getSelectedText()); 
} //_CODE_:noteDroplist:670313:

public void instrumentDroplist_click1(GDropList source, GEvent event) { //_CODE_:instrumentDroplist:276246:
  //setInstrumentScale(instrumentDroplist.getSelectedText(), noteDroplist.getSelectedText(), scaleDroplist.getSelectedText()); 
} //_CODE_:instrumentDroplist:276246:

public void updateButton_click1(GButton source, GEvent event) { //_CODE_:updateButton:231287:
  setInstrumentScale(instrumentDroplist.getSelectedText(), noteDroplist.getSelectedText(), scaleDroplist.getSelectedText()); 
} //_CODE_:updateButton:231287:

public void byFifthsCheckbox_clicked1(GCheckbox source, GEvent event) { //_CODE_:byFifthsCheckbox:433339:
  if(source.isSelected()) {
    setVisByFifths(true);
  }
  else {
    setVisByFifths(false);
  }
} //_CODE_:byFifthsCheckbox:433339:

public void helpPanel_Click1(GPanel source, GEvent event) { //_CODE_:helpPanel:363142:
  println("panel2 - GPanel event occured " + System.currentTimeMillis()%10000000 );
} //_CODE_:helpPanel:363142:

public void textarea2_change1(GTextArea source, GEvent event) { //_CODE_:textarea2:658800:
  println("textarea2 - GTextArea event occured " + System.currentTimeMillis()%10000000 );
} //_CODE_:textarea2:658800:

public void playHighlightedNotes_click1(GButton source, GEvent event) { //_CODE_:playHighlightedNotes:422701:
  println("playHighlightedNotes - GButton event occured " + System.currentTimeMillis()%10000000 );
} //_CODE_:playHighlightedNotes:422701:



// Create all the GUI controls. 
// autogenerated do not edit
public void createGUI(){
  G4P.messagesEnabled(false);
  G4P.setGlobalColorScheme(GCScheme.CYAN_SCHEME);
  G4P.setCursor(ARROW);
  if(frame != null)
    frame.setTitle("Sketch Window");
  scaleDroplist = new GDropList(this, 470, 80, 120, 80, 4);
  scaleDroplist.setItems(loadStrings("list_707967"), 0);
  scaleDroplist.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  scaleDroplist.addEventHandler(this, "scaleDroplist_click1");
  noteDroplist = new GDropList(this, 470, 50, 120, 180, 9);
  noteDroplist.setItems(loadStrings("list_670313"), 3);
  noteDroplist.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  noteDroplist.addEventHandler(this, "noteDroplist_click1");
  instrumentDroplist = new GDropList(this, 470, 20, 120, 60, 3);
  instrumentDroplist.setItems(loadStrings("list_276246"), 1);
  instrumentDroplist.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  instrumentDroplist.addEventHandler(this, "instrumentDroplist_click1");
  updateButton = new GButton(this, 500, 120, 70, 20);
  updateButton.setText("Update");
  updateButton.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  updateButton.addEventHandler(this, "updateButton_click1");
  byFifthsCheckbox = new GCheckbox(this, 470, 160, 120, 20);
  byFifthsCheckbox.setTextAlign(GAlign.LEFT, GAlign.MIDDLE);
  byFifthsCheckbox.setText("Circle of Fifths");
  byFifthsCheckbox.setTextBold();
  byFifthsCheckbox.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  byFifthsCheckbox.setOpaque(false);
  byFifthsCheckbox.addEventHandler(this, "byFifthsCheckbox_clicked1");
  helpPanel = new GPanel(this, 510, 330, 390, 340, "More Help");
  helpPanel.setCollapsed(true);
  helpPanel.setText("More Help");
  helpPanel.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  helpPanel.setOpaque(true);
  helpPanel.addEventHandler(this, "helpPanel_Click1");
  textarea2 = new GTextArea(this, 10, 30, 370, 300, G4P.SCROLLBARS_VERTICAL_ONLY);
  textarea2.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  textarea2.setOpaque(true);
  textarea2.addEventHandler(this, "textarea2_change1");
  helpPanel.addControl(textarea2);
  playHighlightedNotes = new GButton(this, 20, 360, 100, 20);
  playHighlightedNotes.setText("Play Selected");
  playHighlightedNotes.addEventHandler(this, "playHighlightedNotes_click1");
}

// Variable declarations 
// autogenerated do not edit
GDropList scaleDroplist; 
GDropList noteDroplist; 
GDropList instrumentDroplist; 
GButton updateButton; 
GCheckbox byFifthsCheckbox; 
GPanel helpPanel; 
GTextArea textarea2; 
GButton playHighlightedNotes; 


