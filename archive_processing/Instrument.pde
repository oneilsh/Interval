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
    soundMaker.updateInstrumentName(name);
  } 
  
  void playNote(String noteName) {
   String filebase = this.name + noteName; 
   soundMaker.playSound(filebase);
  }
  
  AudioSample getNoteAudio(String noteName) {
   String filebase = this.name + noteName; 
   return soundMaker.getSound(filebase);
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

