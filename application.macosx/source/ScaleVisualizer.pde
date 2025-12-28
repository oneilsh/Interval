/*MusicWheel is copyright Shawn T. O'Neil 2013. Source code is LGPL. If you use it, maybe give me a shoutout?

This file is part of MusicWheel.

    MusicWheel is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Foobar is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with MusicWheel.  If not, see <http://www.gnu.org/licenses/>.
*/

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
  
  int getNoteColor(String note) {
    return noteColors.get(note);
  }
  
  float getNoteAlpha(String note) {
    return noteAlphas.get(note);  
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
      //println("current root: " + currentRoot + " rel: " + musicMaker.getCurrentRelative());
      //float relativePos = noteLocations.get(musicMaker.getCurrentRelative());
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
    textSize(12);
    text("1 through = : All Notes", width - 210, height - 38);
    text("q through ] : Scale Notes", width - 210, height - 22);
    //textAlign(CENTER, TOP);
    //text("Root", centerx, centery - (radius + 50));
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
    colorMode(RGB, 255, 255, 255, 100);
    float noteLoc = noteLocations.get(noteName);
    float xloc = centerx + radius*cos(radians((noteLoc)*30-90));
    float yloc = centery + radius*sin(radians((noteLoc)*30-90));
    if(noteName.compareTo(musicMaker.getCurrentRelative()) == 0) {
      fill(0,0,0);
      strokeWeight(1.5);
      stroke(100, 100, 100, noteAlphas.get(noteName));
      float xlocdot = centerx + radius*1.2*cos(radians((noteLoc)*30-90));
      float ylocdot = centery + radius*1.2*sin(radians((noteLoc)*30-90));
      ellipse(xlocdot, ylocdot, 5, 5);
    }
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

