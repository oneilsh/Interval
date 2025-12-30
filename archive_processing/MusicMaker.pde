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
  
  ArrayList<String> getFifthsFromCurrentRoot() {
   ArrayList<String> toRet = new ArrayList<String>();
   toRet.add(currentRoot);
   String lastAdded = currentRoot;
   for(int i = 1; i < 12; i++) {
     toRet.add(fifths.get(lastAdded));
     lastAdded = fifths.get(lastAdded);
   } 
   return toRet;
  }

  HashMap<String,Integer> getNotesToNumbers() {
   return notesToNumbers; 
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
    fifths.put("A", "E"); 
    fifths.put("E", "B"); 
    fifths.put("B", "F#"); 
    fifths.put("F#", "C#"); 
    fifths.put("C#", "G#"); 
    fifths.put("G#", "D#"); 
    fifths.put("D#", "A#"); 
    fifths.put("A#", "F"); 
    fifths.put("F", "C"); 
    fifths.put("C", "G"); 
    fifths.put("G", "D"); 
    fifths.put("D", "A");
  }

  void setupChordsToNoteLists() {
    // todo: add more chord types
    chordTypesToNoteLists = new HashMap<String, ArrayList<Integer>>(); 
    chordTypesToNoteLists.put("", new ArrayList<Integer>(Arrays.asList(0, 4, 7)));
    chordTypesToNoteLists.put("7", new ArrayList<Integer>(Arrays.asList(0, 4, 7, 10)));
    chordTypesToNoteLists.put("M7", new ArrayList<Integer>(Arrays.asList(0, 4, 7, 11)));
    chordTypesToNoteLists.put("m", new ArrayList<Integer>(Arrays.asList(0, 3, 7)));
    chordTypesToNoteLists.put("m7", new ArrayList<Integer>(Arrays.asList(0, 3, 7, 10)));
    chordTypesToNoteLists.put("f", new ArrayList<Integer>(Arrays.asList(0, 7)));
    chordTypesToNoteLists.put("dim", new ArrayList<Integer>(Arrays.asList(0, 3, 6)));
    chordTypesToNoteLists.put("\u00d87", new ArrayList<Integer>(Arrays.asList(0, 3, 6, 10)));
    chordTypesToNoteLists.put("dim7", new ArrayList<Integer>(Arrays.asList(0, 3, 6, 9)));
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

