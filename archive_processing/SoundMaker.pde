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

import ddf.minim.spi.*;
import ddf.minim.signals.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.ugens.*;
import ddf.minim.effects.*;
import java.util.*;


// Unfortunately minim (at least on OSX) can only have 32 samples open simultaneously. 
// So, I think the soundmaker will have to know of the current Instrument name, and when we 
// change instrument names we'll have to close the currents and open a new set. Sigh...
class SoundMaker {
  HashMap<String, AudioSample> filesToSounds;
  FFT fft;
  // Note that a single minim can only have a certain number of sounds open... (30?)
  Minim minim;
  java.io.File folder;
  java.io.FilenameFilter mp3Filter;
  String instrumentName;

  SoundMaker(PApplet mainobj, String theInstrumentName) {
    instrumentName = theInstrumentName;
    filesToSounds = new HashMap<String, AudioSample>();
    minim = new Minim(mainobj);
    updateFilesToSounds();
  }

  void updateInstrumentName(String newName) {
    instrumentName = newName;
    updateFilesToSounds();
  }

  // closes any open handles, and opens new ones based on the instrumentName
  void updateFilesToSounds() {
    for(String filename : filesToSounds.keySet()) {
      AudioSample player = filesToSounds.get(filename);
      player.close();
    }
    filesToSounds = new HashMap<String,AudioSample>();
    
    folder = new java.io.File(dataPath(""));
    mp3Filter = new java.io.FilenameFilter() {
      public boolean accept(File dir, String name) {
        boolean hasMp3 = name.toLowerCase().endsWith(".mp3");
        boolean hasInstrument = name.matches(".*" + instrumentName + ".*");
        return hasMp3 && hasInstrument;
      }
    };
    java.io.File folder = new java.io.File(dataPath(""));
    String[] filenames = folder.list(mp3Filter);

    for (int i = 0; i < filenames.length; i++) {
      AudioSample sound = minim.loadSample(filenames[i]);
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
    //player.setGain(0.0);
    player.trigger();
  }
  
  AudioSample getSound(String basename) {
    return filesToSounds.get(basename + ".mp3");
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

