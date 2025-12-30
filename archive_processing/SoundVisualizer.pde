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


class SoundVisualizer {

  // we need the soundMaker to get ahold of the audio objects
  // also, the scale visualizer can tell us colors of notes, etc. and soforth
  // we might want access to the musicmaker as well to get the list of notes playing at some point
  Instrument instrument;
  ScaleVisualizer scaleVisualizer;
  MusicMaker musicMaker;
  float myX, myY;
  float myWidth, myHeight;
  float startFreq, endFreq, bins, startExp, base;
  boolean show;

  HashMap<String, ArrayList<Float>> smoothedBands;


  SoundVisualizer(Instrument theInstrument, MusicMaker theMusicMaker, ScaleVisualizer theScaleVisualizer, float x, float y, float thew, float theh) {
    instrument = theInstrument;
    musicMaker = theMusicMaker;
    scaleVisualizer = theScaleVisualizer;
    myX = x; 
    myY = y; 
    myWidth = thew; 
    myHeight = theh;
    startFreq = 55.0;
    endFreq = 110.0;
    bins = 50;
    base = exp(log(endFreq/startFreq)/(bins));
    startExp = log(startFreq)/(log(endFreq/startFreq)/bins);
    show = false;

    smoothedBands = new HashMap<String, ArrayList<Float>>();
    for (String note : musicMaker.getNotesToNumbers().keySet()) {
      smoothedBands.put(note, getBands(note));
    }
  } 


  ArrayList<Float> getBands(String note) {
    ArrayList<Float> toRet = new ArrayList<Float>();
    AudioSample sample = instrument.getNoteAudio(note);
    FFT fftNote = new FFT(sample.bufferSize(), sample.sampleRate()/16);
    //fftNote.logAverages(32,50);
    //fftNote.linAverages(1000);
    fftNote.forward(sample.mix);
    for (int i = 0; i < bins; i++) {
      toRet.add(fftNote.calcAvg(pow(base, i+startExp), pow(base, i+startExp+1)));
    }
    return toRet;
  }

  // Updates the values in the smoothedBands structure by 
  // querying the new bands and smoothing them in
  void updateBands() {
    for (String note : smoothedBands.keySet()) {
      ArrayList<Float> newBands = getBands(note);
      ArrayList<Float> oldBands = smoothedBands.get(note);
      for (int i = 0; i < newBands.size(); i++) {
        float newval = newBands.get(i);
        float oldval = oldBands.get(i);
        oldBands.set(i, newval*0.1 + oldval*0.9);
      }
    }
  }

  void draw() {
    // last3chords will be queue holding the last three played chords; added at the end and removed from the 
    // beginning (why? i dunno why). We'll check it to see if we should turn on the visualizer.
    HashMap<String, ArrayList<String>> currentChords = musicMaker.getCurrentlyPlayingChordsFromNotes(musicMaker.getCurrentlyPlayingNotes());
    for (String chord : currentChords.keySet()) {
      if (chord.compareTo("Caug") == 0) {
        show = true;
      }
      else if (chord.compareTo("C#aug") == 0) {
        show = false;
      }
    }

    if (show) {
      updateBands();

      ArrayList<Float> currentHeights = new ArrayList<Float>();
      for (int i = 0; i < bins; i++) {
        currentHeights.add(0.0);
      }
      float w = myWidth/bins;
      rectMode(CORNERS);
      strokeWeight(0.5);

      for (String note : musicMaker.getFifthsFromCurrentRoot()) {
        ArrayList<Float> heights = smoothedBands.get(note);
        int noteColor = scaleVisualizer.getNoteColor(note);
        float noteAlpha = scaleVisualizer.getNoteAlpha(note);
        fill(noteColor, noteAlpha*0.6);

        for (int i = 0; i < heights.size(); i++) {
          float bottom = currentHeights.get(i);
          float top = heights.get(i) + bottom;
          rect(myX + i*w, myY+myHeight-bottom*4, myX + i*w + w, myY + myHeight - (top*4));
          currentHeights.set(i, top);
        }
      }
    }
  }

  void setCurrentInstrument(Instrument newIns) {
    instrument = newIns;
  }
}
  
