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

// Need G4P library
import g4p_controls.*;
import java.util.*;

Instrument currentInstrument;
MusicMaker musicMaker;
SoundMaker soundMaker;
ScaleVisualizer scaleVisualizer;
SoundVisualizer soundVisualizer;

// todo: add help text/button
public void setup(){
  size(600, 400, P2D);
  strokeWeight(1.5);
  smooth(8);
  background(0,0,0);
  soundMaker = new SoundMaker(this, "Equal Tempered");
  musicMaker = new MusicMaker();
  currentInstrument = new Instrument("Equal Tempered", this, soundMaker, musicMaker);
  scaleVisualizer = new ScaleVisualizer(musicMaker, currentInstrument);
  soundVisualizer = new SoundVisualizer(currentInstrument, musicMaker, scaleVisualizer, width - 210, height - 190, 185, 100);
  
  createGUI();
  customGUI();
}

// Given an instrument, rootnote, and scale type (strings),
// sets the current instrument and scale object
public void setInstrumentScale(String instrumentName, String rootNote, String scaleType) {
  currentInstrument = new Instrument(instrumentName, this, soundMaker, musicMaker);
  musicMaker.setScale(rootNote, scaleType);
  scaleVisualizer.setCurrentInstrument(currentInstrument);
  soundVisualizer.setCurrentInstrument(currentInstrument);
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
  soundVisualizer.draw();
  /*HashMap<Float, Float> pitches = soundMaker.getCurrentPitches();
  for(Float pitch: pitches.keySet()) {
   Float amp = pitches.get(pitch);
   println(pitch + " -> " + amp); 
  }*/
}

void setUpdateRed() {
  updateButton.setLocalColorScheme(GCScheme.RED_SCHEME);

}

void setUpdateCustom() {
  updateButton.setLocalColorScheme(GCScheme.SCHEME_12);
}

// Use this method to add additional statements
// to customise the GUI controls
public void customGUI(){
  helpPanel.setLocalColorScheme(GCScheme.SCHEME_12);
  byFifthsCheckbox.setLocalColorScheme(GCScheme.SCHEME_12);
  updateButton.setLocalColorScheme(GCScheme.SCHEME_12);
  updateButton.fireAllEvents(true);
  instrumentDroplist.setLocalColorScheme(GCScheme.SCHEME_12);
  noteDroplist.setLocalColorScheme(GCScheme.SCHEME_12);
  scaleDroplist.setLocalColorScheme(GCScheme.SCHEME_12);
  textarea2.setLocalColorScheme(GCScheme.SCHEME_12);
  playHighlightedNotes.setLocalColorScheme(GCScheme.SCHEME_12);
  String helpLines[] = loadStrings("help2.txt");
  textarea2.setText(helpLines);
}
