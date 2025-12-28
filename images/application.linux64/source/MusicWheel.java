import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import g4p_controls.*; 
import java.util.*; 
import java.util.*; 
import ddf.minim.spi.*; 
import ddf.minim.signals.*; 
import ddf.minim.*; 
import ddf.minim.analysis.*; 
import ddf.minim.ugens.*; 
import ddf.minim.effects.*; 
import java.util.*; 
import ddf.minim.spi.*; 
import ddf.minim.signals.*; 
import ddf.minim.*; 
import ddf.minim.analysis.*; 
import ddf.minim.ugens.*; 
import ddf.minim.effects.*; 
import java.util.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class MusicWheel extends PApplet {

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



Instrument currentInstrument;
MusicMaker musicMaker;
SoundMaker soundMaker;
ScaleVisualizer scaleVisualizer;
SoundVisualizer soundVisualizer;

// todo: add help text/button
public void setup(){
  size(600, 400, P2D);
  strokeWeight(1.5f);
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

public void keyPressed() {
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

public void keyReleased() {
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

public void setUpdateRed() {
  updateButton.setLocalColorScheme(GCScheme.RED_SCHEME);

}

public void setUpdateCustom() {
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
  
  public void playNote(String noteName) {
   String filebase = this.name + noteName; 
   soundMaker.playSound(filebase);
  }
  
  public AudioSample getNoteAudio(String noteName) {
   String filebase = this.name + noteName; 
   return soundMaker.getSound(filebase);
  }
  
  public void stopNote(String noteName) {
   String filebase = this.name + noteName; 
   soundMaker.stopSound(filebase);
  }
  
  public String getName() {
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

/*
MusicWheel is Copyright Shawn T. O'Neil 2013. Code is released under the LGPL (see GPL and LGPL docs in "License.pde"), 
but if you use it, how about a shout-out of some kind?
*/

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////



/*
                   GNU LESSER GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.


  This version of the GNU Lesser General Public License incorporates
the terms and conditions of version 3 of the GNU General Public
License, supplemented by the additional permissions listed below.

  0. Additional Definitions.

  As used herein, "this License" refers to version 3 of the GNU Lesser
General Public License, and the "GNU GPL" refers to version 3 of the GNU
General Public License.

  "The Library" refers to a covered work governed by this License,
other than an Application or a Combined Work as defined below.

  An "Application" is any work that makes use of an interface provided
by the Library, but which is not otherwise based on the Library.
Defining a subclass of a class defined by the Library is deemed a mode
of using an interface provided by the Library.

  A "Combined Work" is a work produced by combining or linking an
Application with the Library.  The particular version of the Library
with which the Combined Work was made is also called the "Linked
Version".

  The "Minimal Corresponding Source" for a Combined Work means the
Corresponding Source for the Combined Work, excluding any source code
for portions of the Combined Work that, considered in isolation, are
based on the Application, and not on the Linked Version.

  The "Corresponding Application Code" for a Combined Work means the
object code and/or source code for the Application, including any data
and utility programs needed for reproducing the Combined Work from the
Application, but excluding the System Libraries of the Combined Work.

  1. Exception to Section 3 of the GNU GPL.

  You may convey a covered work under sections 3 and 4 of this License
without being bound by section 3 of the GNU GPL.

  2. Conveying Modified Versions.

  If you modify a copy of the Library, and, in your modifications, a
facility refers to a function or data to be supplied by an Application
that uses the facility (other than as an argument passed when the
facility is invoked), then you may convey a copy of the modified
version:

   a) under this License, provided that you make a good faith effort to
   ensure that, in the event an Application does not supply the
   function or data, the facility still operates, and performs
   whatever part of its purpose remains meaningful, or

   b) under the GNU GPL, with none of the additional permissions of
   this License applicable to that copy.

  3. Object Code Incorporating Material from Library Header Files.

  The object code form of an Application may incorporate material from
a header file that is part of the Library.  You may convey such object
code under terms of your choice, provided that, if the incorporated
material is not limited to numerical parameters, data structure
layouts and accessors, or small macros, inline functions and templates
(ten or fewer lines in length), you do both of the following:

   a) Give prominent notice with each copy of the object code that the
   Library is used in it and that the Library and its use are
   covered by this License.

   b) Accompany the object code with a copy of the GNU GPL and this license
   document.

  4. Combined Works.

  You may convey a Combined Work under terms of your choice that,
taken together, effectively do not restrict modification of the
portions of the Library contained in the Combined Work and reverse
engineering for debugging such modifications, if you also do each of
the following:

   a) Give prominent notice with each copy of the Combined Work that
   the Library is used in it and that the Library and its use are
   covered by this License.

   b) Accompany the Combined Work with a copy of the GNU GPL and this license
   document.

   c) For a Combined Work that displays copyright notices during
   execution, include the copyright notice for the Library among
   these notices, as well as a reference directing the user to the
   copies of the GNU GPL and this license document.

   d) Do one of the following:

       0) Convey the Minimal Corresponding Source under the terms of this
       License, and the Corresponding Application Code in a form
       suitable for, and under terms that permit, the user to
       recombine or relink the Application with a modified version of
       the Linked Version to produce a modified Combined Work, in the
       manner specified by section 6 of the GNU GPL for conveying
       Corresponding Source.

       1) Use a suitable shared library mechanism for linking with the
       Library.  A suitable mechanism is one that (a) uses at run time
       a copy of the Library already present on the user's computer
       system, and (b) will operate properly with a modified version
       of the Library that is interface-compatible with the Linked
       Version.

   e) Provide Installation Information, but only if you would otherwise
   be required to provide such information under section 6 of the
   GNU GPL, and only to the extent that such information is
   necessary to install and execute a modified version of the
   Combined Work produced by recombining or relinking the
   Application with a modified version of the Linked Version. (If
   you use option 4d0, the Installation Information must accompany
   the Minimal Corresponding Source and Corresponding Application
   Code. If you use option 4d1, you must provide the Installation
   Information in the manner specified by section 6 of the GNU GPL
   for conveying Corresponding Source.)

  5. Combined Libraries.

  You may place library facilities that are a work based on the
Library side by side in a single library together with other library
facilities that are not Applications and are not covered by this
License, and convey such a combined library under terms of your
choice, if you do both of the following:

   a) Accompany the combined library with a copy of the same work based
   on the Library, uncombined with any other library facilities,
   conveyed under the terms of this License.

   b) Give prominent notice with the combined library that part of it
   is a work based on the Library, and explaining where to find the
   accompanying uncombined form of the same work.

  6. Revised Versions of the GNU Lesser General Public License.

  The Free Software Foundation may publish revised and/or new versions
of the GNU Lesser General Public License from time to time. Such new
versions will be similar in spirit to the present version, but may
differ in detail to address new problems or concerns.

  Each version is given a distinguishing version number. If the
Library as you received it specifies that a certain numbered version
of the GNU Lesser General Public License "or any later version"
applies to it, you have the option of following the terms and
conditions either of that published version or of any later version
published by the Free Software Foundation. If the Library as you
received it does not specify a version number of the GNU Lesser
General Public License, you may choose any version of the GNU Lesser
General Public License ever published by the Free Software Foundation.

  If the Library as you received it specifies that a proxy can decide
whether future versions of the GNU Lesser General Public License shall
apply, that proxy's public statement of acceptance of any version is
permanent authorization for you to choose that version for the
Library.
*/

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////



/*
                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights.  Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received.  You must make sure that they, too, receive
or can get the source code.  And you must show them these terms so they
know their rights.

  Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

  For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software.  For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

  Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so.  This is fundamentally incompatible with the aim of
protecting users' freedom to change the software.  The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable.  Therefore, we
have designed this version of the GPL to prohibit the practice for those
products.  If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

  Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary.  To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

  The precise terms and conditions for copying, distribution and
modification follow.

                       TERMS AND CONDITIONS

  0. Definitions.

  "This License" refers to version 3 of the GNU General Public License.

  "Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

  "The Program" refers to any copyrightable work licensed under this
License.  Each licensee is addressed as "you".  "Licensees" and
"recipients" may be individuals or organizations.

  To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy.  The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

  A "covered work" means either the unmodified Program or a work based
on the Program.

  To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy.  Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

  To "convey" a work means any kind of propagation that enables other
parties to make or receive copies.  Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

  An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License.  If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

  1. Source Code.

  The "source code" for a work means the preferred form of the work
for making modifications to it.  "Object code" means any non-source
form of a work.

  A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

  The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form.  A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or an object code interpreter used to run it.

  The "Corresponding Source" for a work in object code form means all
the source code needed to generate, install, and (for an executable
work) run the object code and to modify the work, including scripts to
control those activities.  However, it does not include the work's
System Libraries, or general-purpose tools or generally available free
programs which are used unmodified in performing those activities but
which are not part of the work.  For example, Corresponding Source
includes interface definition files associated with source files for
the work, and the source code for shared libraries and dynamically
linked subprograms that the work is specifically designed to require,
such as by intimate data communication or control flow between those
subprograms and other parts of the work.

  The Corresponding Source need not include anything that users
can regenerate automatically from other parts of the Corresponding
Source.

  The Corresponding Source for a work in source code form is that
same work.

  2. Basic Permissions.

  All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met.  This License explicitly affirms your unlimited
permission to run the unmodified Program.  The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work.  This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

  You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force.  You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright.  Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of
your copyrighted material outside their relationship with you.

  Conveying under any other circumstances is permitted solely under
the conditions stated below.  Sublicensing is not allowed; section 10
makes it unnecessary.

  3. Protecting Users' Legal Rights From Anti-Circumvention Law.

  No covered work shall be deemed part of an effective technological
measure under any applicable law fulfilling obligations under article
11 of the WIPO copyright treaty adopted on 20 December 1996, or
similar laws prohibiting or restricting circumvention of such
measures.

  When you convey a covered work, you waive any legal power to forbid
circumvention of technological measures to the extent such circumvention
is effected by exercising rights under this License with respect to
the covered work, and you disclaim any intention to limit operation or
modification of the work as a means of enforcing, against the work's
users, your or third parties' legal rights to forbid circumvention of
technological measures.

  4. Conveying Verbatim Copies.

  You may convey verbatim copies of the Program's source code as you
receive it, in any medium, provided that you conspicuously and
appropriately publish on each copy an appropriate copyright notice;
keep intact all notices stating that this License and any
non-permissive terms added in accord with section 7 apply to the code;
keep intact all notices of the absence of any warranty; and give all
recipients a copy of this License along with the Program.

  You may charge any price or no price for each copy that you convey,
and you may offer support or warranty protection for a fee.

  5. Conveying Modified Source Versions.

  You may convey a work based on the Program, or the modifications to
produce it from the Program, in the form of source code under the
terms of section 4, provided that you also meet all of these conditions:

    a) The work must carry prominent notices stating that you modified
    it, and giving a relevant date.

    b) The work must carry prominent notices stating that it is
    released under this License and any conditions added under section
    7.  This requirement modifies the requirement in section 4 to
    "keep intact all notices".

    c) You must license the entire work, as a whole, under this
    License to anyone who comes into possession of a copy.  This
    License will therefore apply, along with any applicable section 7
    additional terms, to the whole of the work, and all its parts,
    regardless of how they are packaged.  This License gives no
    permission to license the work in any other way, but it does not
    invalidate such permission if you have separately received it.

    d) If the work has interactive user interfaces, each must display
    Appropriate Legal Notices; however, if the Program has interactive
    interfaces that do not display Appropriate Legal Notices, your
    work need not make them do so.

  A compilation of a covered work with other separate and independent
works, which are not by their nature extensions of the covered work,
and which are not combined with it such as to form a larger program,
in or on a volume of a storage or distribution medium, is called an
"aggregate" if the compilation and its resulting copyright are not
used to limit the access or legal rights of the compilation's users
beyond what the individual works permit.  Inclusion of a covered work
in an aggregate does not cause this License to apply to the other
parts of the aggregate.

  6. Conveying Non-Source Forms.

  You may convey a covered work in object code form under the terms
of sections 4 and 5, provided that you also convey the
machine-readable Corresponding Source under the terms of this License,
in one of these ways:

    a) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by the
    Corresponding Source fixed on a durable physical medium
    customarily used for software interchange.

    b) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by a
    written offer, valid for at least three years and valid for as
    long as you offer spare parts or customer support for that product
    model, to give anyone who possesses the object code either (1) a
    copy of the Corresponding Source for all the software in the
    product that is covered by this License, on a durable physical
    medium customarily used for software interchange, for a price no
    more than your reasonable cost of physically performing this
    conveying of source, or (2) access to copy the
    Corresponding Source from a network server at no charge.

    c) Convey individual copies of the object code with a copy of the
    written offer to provide the Corresponding Source.  This
    alternative is allowed only occasionally and noncommercially, and
    only if you received the object code with such an offer, in accord
    with subsection 6b.

    d) Convey the object code by offering access from a designated
    place (gratis or for a charge), and offer equivalent access to the
    Corresponding Source in the same way through the same place at no
    further charge.  You need not require recipients to copy the
    Corresponding Source along with the object code.  If the place to
    copy the object code is a network server, the Corresponding Source
    may be on a different server (operated by you or a third party)
    that supports equivalent copying facilities, provided you maintain
    clear directions next to the object code saying where to find the
    Corresponding Source.  Regardless of what server hosts the
    Corresponding Source, you remain obligated to ensure that it is
    available for as long as needed to satisfy these requirements.

    e) Convey the object code using peer-to-peer transmission, provided
    you inform other peers where the object code and Corresponding
    Source of the work are being offered to the general public at no
    charge under subsection 6d.

  A separable portion of the object code, whose source code is excluded
from the Corresponding Source as a System Library, need not be
included in conveying the object code work.

  A "User Product" is either (1) a "consumer product", which means any
tangible personal property which is normally used for personal, family,
or household purposes, or (2) anything designed or sold for incorporation
into a dwelling.  In determining whether a product is a consumer product,
doubtful cases shall be resolved in favor of coverage.  For a particular
product received by a particular user, "normally used" refers to a
typical or common use of that class of product, regardless of the status
of the particular user or of the way in which the particular user
actually uses, or expects or is expected to use, the product.  A product
is a consumer product regardless of whether the product has substantial
commercial, industrial or non-consumer uses, unless such uses represent
the only significant mode of use of the product.

  "Installation Information" for a User Product means any methods,
procedures, authorization keys, or other information required to install
and execute modified versions of a covered work in that User Product from
a modified version of its Corresponding Source.  The information must
suffice to ensure that the continued functioning of the modified object
code is in no case prevented or interfered with solely because
modification has been made.

  If you convey an object code work under this section in, or with, or
specifically for use in, a User Product, and the conveying occurs as
part of a transaction in which the right of possession and use of the
User Product is transferred to the recipient in perpetuity or for a
fixed term (regardless of how the transaction is characterized), the
Corresponding Source conveyed under this section must be accompanied
by the Installation Information.  But this requirement does not apply
if neither you nor any third party retains the ability to install
modified object code on the User Product (for example, the work has
been installed in ROM).

  The requirement to provide Installation Information does not include a
requirement to continue to provide support service, warranty, or updates
for a work that has been modified or installed by the recipient, or for
the User Product in which it has been modified or installed.  Access to a
network may be denied when the modification itself materially and
adversely affects the operation of the network or violates the rules and
protocols for communication across the network.

  Corresponding Source conveyed, and Installation Information provided,
in accord with this section must be in a format that is publicly
documented (and with an implementation available to the public in
source code form), and must require no special password or key for
unpacking, reading or copying.

  7. Additional Terms.

  "Additional permissions" are terms that supplement the terms of this
License by making exceptions from one or more of its conditions.
Additional permissions that are applicable to the entire Program shall
be treated as though they were included in this License, to the extent
that they are valid under applicable law.  If additional permissions
apply only to part of the Program, that part may be used separately
under those permissions, but the entire Program remains governed by
this License without regard to the additional permissions.

  When you convey a copy of a covered work, you may at your option
remove any additional permissions from that copy, or from any part of
it.  (Additional permissions may be written to require their own
removal in certain cases when you modify the work.)  You may place
additional permissions on material, added by you to a covered work,
for which you have or can give appropriate copyright permission.

  Notwithstanding any other provision of this License, for material you
add to a covered work, you may (if authorized by the copyright holders of
that material) supplement the terms of this License with terms:

    a) Disclaiming warranty or limiting liability differently from the
    terms of sections 15 and 16 of this License; or

    b) Requiring preservation of specified reasonable legal notices or
    author attributions in that material or in the Appropriate Legal
    Notices displayed by works containing it; or

    c) Prohibiting misrepresentation of the origin of that material, or
    requiring that modified versions of such material be marked in
    reasonable ways as different from the original version; or

    d) Limiting the use for publicity purposes of names of licensors or
    authors of the material; or

    e) Declining to grant rights under trademark law for use of some
    trade names, trademarks, or service marks; or

    f) Requiring indemnification of licensors and authors of that
    material by anyone who conveys the material (or modified versions of
    it) with contractual assumptions of liability to the recipient, for
    any liability that these contractual assumptions directly impose on
    those licensors and authors.

  All other non-permissive additional terms are considered "further
restrictions" within the meaning of section 10.  If the Program as you
received it, or any part of it, contains a notice stating that it is
governed by this License along with a term that is a further
restriction, you may remove that term.  If a license document contains
a further restriction but permits relicensing or conveying under this
License, you may add to a covered work material governed by the terms
of that license document, provided that the further restriction does
not survive such relicensing or conveying.

  If you add terms to a covered work in accord with this section, you
must place, in the relevant source files, a statement of the
additional terms that apply to those files, or a notice indicating
where to find the applicable terms.

  Additional terms, permissive or non-permissive, may be stated in the
form of a separately written license, or stated as exceptions;
the above requirements apply either way.

  8. Termination.

  You may not propagate or modify a covered work except as expressly
provided under this License.  Any attempt otherwise to propagate or
modify it is void, and will automatically terminate your rights under
this License (including any patent licenses granted under the third
paragraph of section 11).

  However, if you cease all violation of this License, then your
license from a particular copyright holder is reinstated (a)
provisionally, unless and until the copyright holder explicitly and
finally terminates your license, and (b) permanently, if the copyright
holder fails to notify you of the violation by some reasonable means
prior to 60 days after the cessation.

  Moreover, your license from a particular copyright holder is
reinstated permanently if the copyright holder notifies you of the
violation by some reasonable means, this is the first time you have
received notice of violation of this License (for any work) from that
copyright holder, and you cure the violation prior to 30 days after
your receipt of the notice.

  Termination of your rights under this section does not terminate the
licenses of parties who have received copies or rights from you under
this License.  If your rights have been terminated and not permanently
reinstated, you do not qualify to receive new licenses for the same
material under section 10.

  9. Acceptance Not Required for Having Copies.

  You are not required to accept this License in order to receive or
run a copy of the Program.  Ancillary propagation of a covered work
occurring solely as a consequence of using peer-to-peer transmission
to receive a copy likewise does not require acceptance.  However,
nothing other than this License grants you permission to propagate or
modify any covered work.  These actions infringe copyright if you do
not accept this License.  Therefore, by modifying or propagating a
covered work, you indicate your acceptance of this License to do so.

  10. Automatic Licensing of Downstream Recipients.

  Each time you convey a covered work, the recipient automatically
receives a license from the original licensors, to run, modify and
propagate that work, subject to this License.  You are not responsible
for enforcing compliance by third parties with this License.

  An "entity transaction" is a transaction transferring control of an
organization, or substantially all assets of one, or subdividing an
organization, or merging organizations.  If propagation of a covered
work results from an entity transaction, each party to that
transaction who receives a copy of the work also receives whatever
licenses to the work the party's predecessor in interest had or could
give under the previous paragraph, plus a right to possession of the
Corresponding Source of the work from the predecessor in interest, if
the predecessor has it or can get it with reasonable efforts.

  You may not impose any further restrictions on the exercise of the
rights granted or affirmed under this License.  For example, you may
not impose a license fee, royalty, or other charge for exercise of
rights granted under this License, and you may not initiate litigation
(including a cross-claim or counterclaim in a lawsuit) alleging that
any patent claim is infringed by making, using, selling, offering for
sale, or importing the Program or any portion of it.

  11. Patents.

  A "contributor" is a copyright holder who authorizes use under this
License of the Program or a work on which the Program is based.  The
work thus licensed is called the contributor's "contributor version".

  A contributor's "essential patent claims" are all patent claims
owned or controlled by the contributor, whether already acquired or
hereafter acquired, that would be infringed by some manner, permitted
by this License, of making, using, or selling its contributor version,
but do not include claims that would be infringed only as a
consequence of further modification of the contributor version.  For
purposes of this definition, "control" includes the right to grant
patent sublicenses in a manner consistent with the requirements of
this License.

  Each contributor grants you a non-exclusive, worldwide, royalty-free
patent license under the contributor's essential patent claims, to
make, use, sell, offer for sale, import and otherwise run, modify and
propagate the contents of its contributor version.

  In the following three paragraphs, a "patent license" is any express
agreement or commitment, however denominated, not to enforce a patent
(such as an express permission to practice a patent or covenant not to
sue for patent infringement).  To "grant" such a patent license to a
party means to make such an agreement or commitment not to enforce a
patent against the party.

  If you convey a covered work, knowingly relying on a patent license,
and the Corresponding Source of the work is not available for anyone
to copy, free of charge and under the terms of this License, through a
publicly available network server or other readily accessible means,
then you must either (1) cause the Corresponding Source to be so
available, or (2) arrange to deprive yourself of the benefit of the
patent license for this particular work, or (3) arrange, in a manner
consistent with the requirements of this License, to extend the patent
license to downstream recipients.  "Knowingly relying" means you have
actual knowledge that, but for the patent license, your conveying the
covered work in a country, or your recipient's use of the covered work
in a country, would infringe one or more identifiable patents in that
country that you have reason to believe are valid.

  If, pursuant to or in connection with a single transaction or
arrangement, you convey, or propagate by procuring conveyance of, a
covered work, and grant a patent license to some of the parties
receiving the covered work authorizing them to use, propagate, modify
or convey a specific copy of the covered work, then the patent license
you grant is automatically extended to all recipients of the covered
work and works based on it.

  A patent license is "discriminatory" if it does not include within
the scope of its coverage, prohibits the exercise of, or is
conditioned on the non-exercise of one or more of the rights that are
specifically granted under this License.  You may not convey a covered
work if you are a party to an arrangement with a third party that is
in the business of distributing software, under which you make payment
to the third party based on the extent of your activity of conveying
the work, and under which the third party grants, to any of the
parties who would receive the covered work from you, a discriminatory
patent license (a) in connection with copies of the covered work
conveyed by you (or copies made from those copies), or (b) primarily
for and in connection with specific products or compilations that
contain the covered work, unless you entered into that arrangement,
or that patent license was granted, prior to 28 March 2007.

  Nothing in this License shall be construed as excluding or limiting
any implied license or other defenses to infringement that may
otherwise be available to you under applicable patent law.

  12. No Surrender of Others' Freedom.

  If conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot convey a
covered work so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you may
not convey it at all.  For example, if you agree to terms that obligate you
to collect a royalty for further conveying from those to whom you convey
the Program, the only way you could satisfy both those terms and this
License would be to refrain entirely from conveying the Program.

  13. Use with the GNU Affero General Public License.

  Notwithstanding any other provision of this License, you have
permission to link or combine any covered work with a work licensed
under version 3 of the GNU Affero General Public License into a single
combined work, and to convey the resulting work.  The terms of this
License will continue to apply to the part which is the covered work,
but the special requirements of the GNU Affero General Public License,
section 13, concerning interaction through a network will apply to the
combination as such.

  14. Revised Versions of this License.

  The Free Software Foundation may publish revised and/or new versions of
the GNU General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

  Each version is given a distinguishing version number.  If the
Program specifies that a certain numbered version of the GNU General
Public License "or any later version" applies to it, you have the
option of following the terms and conditions either of that numbered
version or of any later version published by the Free Software
Foundation.  If the Program does not specify a version number of the
GNU General Public License, you may choose any version ever published
by the Free Software Foundation.

  If the Program specifies that a proxy can decide which future
versions of the GNU General Public License can be used, that proxy's
public statement of acceptance of a version permanently authorizes you
to choose that version for the Program.

  Later license versions may give you additional or different
permissions.  However, no additional obligations are imposed on any
author or copyright holder as a result of your choosing to follow a
later version.

  15. Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

  16. Limitation of Liability.

  IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS
THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY
GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE
USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF
DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD
PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),
EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGES.

  17. Interpretation of Sections 15 and 16.

  If the disclaimer of warranty and limitation of liability provided
above cannot be given local legal effect according to their terms,
reviewing courts shall apply local law that most closely approximates
an absolute waiver of all civil liability in connection with the
Program, unless a warranty or assumption of liability accompanies a
copy of the Program in return for a fee.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
state the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

  If the program does terminal interaction, make it output a short
notice like this when it starts in an interactive mode:

    <program>  Copyright (C) <year>  <name of author>
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.

The hypothetical commands `show w' and `show c' should show the appropriate
parts of the General Public License.  Of course, your program's commands
might be different; for a GUI interface, you would use an "about box".

  You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU GPL, see
<http://www.gnu.org/licenses/>.

  The GNU General Public License does not permit incorporating your program
into proprietary programs.  If your program is a subroutine library, you
may consider it more useful to permit linking proprietary applications with
the library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.  But first, please read
<http://www.gnu.org/philosophy/why-not-lgpl.html>.
*/


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
  
  public ArrayList<String> getFifthsFromCurrentRoot() {
   ArrayList<String> toRet = new ArrayList<String>();
   toRet.add(currentRoot);
   String lastAdded = currentRoot;
   for(int i = 1; i < 12; i++) {
     toRet.add(fifths.get(lastAdded));
     lastAdded = fifths.get(lastAdded);
   } 
   return toRet;
  }

  public HashMap<String,Integer> getNotesToNumbers() {
   return notesToNumbers; 
  }

  public String getFifth(String note) {
    return(fifths.get(note)); 
  }

  public String getCurrentScaleName() {
   return currentRoot + " " + currentScaleType; 
  }

  public String getCurrentRoot() {
    return currentRoot;
  }

  public HashMap<String, Integer> getCurrentlyPlayingNotes() {
    return currentlyPlayingNotes;
  }

  public void addPlayingNote(String noteName) {
    currentlyPlayingNotes.put(noteName, 1);
  }

  public void releasePlayingNote(String noteName) {
    if (currentlyPlayingNotes.containsKey(noteName)) {
      currentlyPlayingNotes.remove(noteName);
    }
  }

  public boolean isNoteInCurrentScale(String theNote) {
    if (currentScaleNotes.containsKey(theNote)) {
      return true;
    }
    return false;
  }

  public void setScale(String root, String type) {
    currentRoot = root;
    currentScaleType = type;
    currentPattern = scaleTypesToPatterns.get(currentScaleType);
    currentScaleNotes = new HashMap<String, Integer>();
    for (int i = 1; i <= currentPattern.size(); i++) {
      String name = getNoteNameFromNumberInCurrentScale(i);
      currentScaleNotes.put(name, 1);
    }
  }
  
  public String getNoteNameFromNumRelativeToRoot(int theNum) {
    int rootNum = getNumFromNoteName(currentRoot);
    int playNum = (rootNum + theNum)%12;
    return getNoteNameFromNum(playNum);
  }
  
  public boolean isNotePlaying(String name) {
    if(currentlyPlayingNotes.containsKey(name)) {
      return true;
    }
   return false; 
  }

  // given a number, returns that note relative to the root note, from the pattern. 
  // For example, if our root is C (note 3) in C major, and we want to play note 5 from
  // the scale (G), then we want the 3 + the 5th (at index 4...) in the pattern (0,2,4,5,_7_,9,11), MOD the
  // size of the pattern, mod the size of the note collection. whew.
  public String getNoteNameFromNumberInCurrentScale(int theNum) {
    int rootNum = getNumFromNoteName(currentRoot);
    int patternindex = theNum - 1;
    patternindex = patternindex%(currentPattern.size());
    int patternnum = currentPattern.get(patternindex);
    int notenum = (rootNum + patternnum)%12;
    String noteName = getNoteNameFromNum(notenum);
    return noteName;
  }

  public String getCurrentRelative() {
     String toRet = "";
     if(!currentScaleType.matches("Major.*")) {
       toRet = getNoteNameFromNum((getNumFromNoteName(currentRoot) + 3)%12);
     } 
     else {
       toRet = getNoteNameFromNum((getNumFromNoteName(currentRoot) - 3+12)%12);
     }
     return toRet;
  }

  public void setupFifths() {
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

  public void setupChordsToNoteLists() {
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
  public HashMap<String, ArrayList<String>> getCurrentlyPlayingChordsFromNotes(HashMap<String, Integer> currentNotes) {
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

  public void setupNotesToNumbers() {
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

  public void setupNumbersToNotes() {
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

  public String getNoteNameFromNum(int thenum) {
    String name = numbersToNotes.get(thenum);
    return name;
  }

  public int getNumFromNoteName(String name) {
    int num = notesToNumbers.get(name);
    return num;
  }

  public void setupScaleTypesToPatterns() {
    scaleTypesToPatterns = new HashMap<String, ArrayList<Integer>>();
    // todo: add pentatonic scales
    scaleTypesToPatterns.put("Major", new ArrayList<Integer>(Arrays.asList(0, 2, 4, 5, 7, 9, 11)));
    scaleTypesToPatterns.put("Minor", new ArrayList<Integer>(Arrays.asList(0, 2, 3, 5, 7, 8, 10)));
    scaleTypesToPatterns.put("Minor Pent.", new ArrayList<Integer>(Arrays.asList(0, 3, 5, 7, 10)));
    scaleTypesToPatterns.put("Major Pent.", new ArrayList<Integer>(Arrays.asList(0, 2, 4, 7, 9)));
    scaleTypesToPatterns.put("Blues", new ArrayList<Integer>(Arrays.asList(0, 3, 5, 6, 7, 10)));
  }
}

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
  
  public int getNoteColor(String note) {
    return noteColors.get(note);
  }
  
  public float getNoteAlpha(String note) {
    return noteAlphas.get(note);  
  }
  
  public String getNote(int x, int y) {
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
  public boolean updateNoteLocationsByFifthsAndRoot() {
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
      if (correctPos >= 12.0f) {
        correctPos = correctPos - 12.0f;
      } 
      else if (correctPos < 0.0f) {
        correctPos = correctPos + 12.0f;
      }
      //println("note: " + note + " currentpos: " + currentPos + " correct: " + correctPos);
      // rotate into place, either left or right based on where the current root is; 
      // note that 0.0 and 12.0 are "equal"..
      //println("current root: " + currentRoot + " rel: " + musicMaker.getCurrentRelative());
      //float relativePos = noteLocations.get(musicMaker.getCurrentRelative());
      float rootPos = noteLocations.get(currentRoot);
      if(abs(correctPos - currentPos) >= 0.06f) {
        if (rootPos <= 6.0f) {
          currentPos = currentPos - 0.05f;
        }
        else {
          currentPos = currentPos + 0.05f;
        }
        changed = true;
      }
      else {
       // round to nearest int once it's close enough
        currentPos = PApplet.parseInt(currentPos + 0.5f)+0.0f; 
      }
      // make sure we stay in [0,12]
      if (currentPos >= 12.0f) {
        currentPos = currentPos - 12.0f;
      } 
      else if (currentPos < 0) {
        currentPos = currentPos + 12.0f;
      }
      noteLocations.put(note, currentPos);
    }
    return changed;
  }

  // get's the note alphas one step closer to correct according
  // to the current scale
  public boolean updateNoteAlphasByCurrentScale() {
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
      if (abs(newval - oldval) > 0.5f) {
        noteAlphas.put(noteName, (newval+oldval*8)/9.0f);
        change = true;
      }
    }
    return change;
  }

  public void setCurrentInstrument(Instrument newInstrument) {
    currentInstrument = newInstrument;
  }

  public void setByFifths(boolean toSet) {
    byFifths = toSet;
  }

  public void draw() {
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

  public void drawOverallInfo() {
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

  public void drawNotes() {
    textSize(16);
    textAlign(CENTER, CENTER);
    for (String noteName : noteLocations.keySet()) {
      drawNote(noteName);
    }
  }

  public void drawChords() {
    HashMap<String, ArrayList<String>> chords = musicMaker.getCurrentlyPlayingChordsFromNotes(musicMaker.getCurrentlyPlayingNotes()); 
    for (String chord : chords.keySet()) {
      drawChord(chord, chords.get(chord));
    }
  }

  public void drawChord(String chordName, ArrayList<String> notes) { 
    strokeWeight(0);
    colorMode(HSB, 360, 255, 255, 100);
    beginShape();
    boolean root = true;
    float rootxloc = 0;
    float rootyloc = 0;
    int rootColor = 0;
    for (String note : notes) {
      fill(noteColors.get(note), noteAlphas.get(note)*0.5f);
      float noteLoc = noteLocations.get(note);
      if (root) {
        //rootxloc = rootxloc + (3.0/(notes.size()+2))*(centerx + radius*0.7*cos(radians((noteLoc)*30-90)));
        //rootyloc = rootyloc + (3.0/(notes.size()+2))*(centery + radius*0.7*sin(radians((noteLoc)*30-90)));
        rootColor = noteColors.get(note);
        rootxloc = rootxloc + (1.0f/(notes.size()))*(centerx + radius*1.3f*cos(radians((noteLoc)*30-90)));
        rootyloc = rootyloc + (1.0f/(notes.size()))*(centery + radius*1.3f*sin(radians((noteLoc)*30-90)));
      }
      else {
        //rootxloc = rootxloc + (1.0/(notes.size()+2))*(centerx + radius*0.7*cos(radians((noteLoc)*30-90)));
        //rootyloc = rootyloc + (1.0/(notes.size()+2))*(centery + radius*0.7*sin(radians((noteLoc)*30-90)));
        rootxloc = rootxloc + (1.0f/(notes.size()))*(centerx + radius*1.0f*cos(radians((noteLoc)*30-90)));
        rootyloc = rootyloc + (1.0f/(notes.size()))*(centery + radius*1.0f*sin(radians((noteLoc)*30-90)));
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

  public void drawNote(String noteName) {
    colorMode(RGB, 255, 255, 255, 100);
    float noteLoc = noteLocations.get(noteName);
    float xloc = centerx + radius*cos(radians((noteLoc)*30-90));
    float yloc = centery + radius*sin(radians((noteLoc)*30-90));
    if(noteName.compareTo(musicMaker.getCurrentRelative()) == 0) {
      fill(0,0,0);
      strokeWeight(1.5f);
      stroke(100, 100, 100, noteAlphas.get(noteName));
      float xlocdot = centerx + radius*1.2f*cos(radians((noteLoc)*30-90));
      float ylocdot = centery + radius*1.2f*sin(radians((noteLoc)*30-90));
      ellipse(xlocdot, ylocdot, 5, 5);
    }
    fill(0, 0, 0);
    if (musicMaker.isNotePlaying(noteName)) {
      strokeWeight(4);
      stroke(noteColors.get(noteName));
    }
    else {
      strokeWeight(1.5f);
      stroke(100, 100, 100, noteAlphas.get(noteName));
    }
    ellipse(xloc, yloc, noteCircumference, noteCircumference);
    fill(noteColors.get(noteName), noteAlphas.get(noteName));
    text(noteName, xloc, yloc-2.5f);
  }

  public void setupNoteColorsAlphas() {
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
    noteAlphas.put("C", 100.0f);
    noteAlphas.put("C#", 100.0f);
    noteAlphas.put("D", 100.0f);
    noteAlphas.put("D#", 100.0f);
    noteAlphas.put("E", 100.0f);
    noteAlphas.put("F", 100.0f);
    noteAlphas.put("F#", 100.0f);
    noteAlphas.put("G", 100.0f);
    noteAlphas.put("G#", 100.0f);
    noteAlphas.put("A", 100.0f);
    noteAlphas.put("A#", 100.0f);
    noteAlphas.put("B", 100.0f);

    // we'll start in C major ;)
    noteLocations = new HashMap<String, Float>();
    noteLocations.put("A", 9.0f);
    noteLocations.put("A#", 10.0f);
    noteLocations.put("B", 11.0f);
    noteLocations.put("C", 0.0f);
    noteLocations.put("C#", 1.0f);
    noteLocations.put("D", 2.0f);
    noteLocations.put("D#", 3.0f);
    noteLocations.put("E", 4.0f);
    noteLocations.put("F", 5.0f);
    noteLocations.put("F#", 6.0f);
    noteLocations.put("G", 7.0f);
    noteLocations.put("G#", 8.0f);

    // circle of fifths...
    chromaticLocations = new HashMap<String, Float>();
    chromaticLocations.put("A", 0.0f);
    chromaticLocations.put("A#", 1.0f);
    chromaticLocations.put("B", 2.0f);
    chromaticLocations.put("C", 3.0f);
    chromaticLocations.put("C#", 4.0f);
    chromaticLocations.put("D", 5.0f);
    chromaticLocations.put("D#", 6.0f);
    chromaticLocations.put("E", 7.0f);
    chromaticLocations.put("F", 8.0f);
    chromaticLocations.put("F#", 9.0f);
    chromaticLocations.put("G", 10.0f);
    chromaticLocations.put("G#", 11.0f);

    fifthLocations = new HashMap<String, Float>();
    fifthLocations.put("A", 0.0f);
    fifthLocations.put("E", 1.0f);
    fifthLocations.put("B", 2.0f);
    fifthLocations.put("F#", 3.0f);
    fifthLocations.put("C#", 4.0f);
    fifthLocations.put("G#", 5.0f);
    fifthLocations.put("D#", 6.0f);
    fifthLocations.put("A#", 7.0f);
    fifthLocations.put("F", 8.0f);
    fifthLocations.put("C", 9.0f);
    fifthLocations.put("G", 10.0f);
    fifthLocations.put("D", 11.0f);
  }
}

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

  public void updateInstrumentName(String newName) {
    instrumentName = newName;
    updateFilesToSounds();
  }

  // closes any open handles, and opens new ones based on the instrumentName
  public void updateFilesToSounds() {
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

  public void playSound(String basename) {
    AudioSample player = filesToSounds.get(basename + ".mp3");
    //player.rewind();
    //player.setGain(0.0);
    player.trigger();
  }
  
  public AudioSample getSound(String basename) {
    return filesToSounds.get(basename + ".mp3");
  }
  
  public void stopSound(String basename) {
   /* AudioSample player = filesToSounds.get(basename + ".mp3");
    //player.shiftGain(0.0,-60.0, 1000);
    for(int i = 0; i > -60; i--) {
     player.setGain(i); 
     delay(10);
    }*/
    //player.rewind();
  }
}

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
    startFreq = 55.0f;
    endFreq = 110.0f;
    bins = 50;
    base = exp(log(endFreq/startFreq)/(bins));
    startExp = log(startFreq)/(log(endFreq/startFreq)/bins);
    show = false;

    smoothedBands = new HashMap<String, ArrayList<Float>>();
    for (String note : musicMaker.getNotesToNumbers().keySet()) {
      smoothedBands.put(note, getBands(note));
    }
  } 


  public ArrayList<Float> getBands(String note) {
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
  public void updateBands() {
    for (String note : smoothedBands.keySet()) {
      ArrayList<Float> newBands = getBands(note);
      ArrayList<Float> oldBands = smoothedBands.get(note);
      for (int i = 0; i < newBands.size(); i++) {
        float newval = newBands.get(i);
        float oldval = oldBands.get(i);
        oldBands.set(i, newval*0.1f + oldval*0.9f);
      }
    }
  }

  public void draw() {
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
        currentHeights.add(0.0f);
      }
      float w = myWidth/bins;
      rectMode(CORNERS);
      strokeWeight(0.5f);

      for (String note : musicMaker.getFifthsFromCurrentRoot()) {
        ArrayList<Float> heights = smoothedBands.get(note);
        int noteColor = scaleVisualizer.getNoteColor(note);
        float noteAlpha = scaleVisualizer.getNoteAlpha(note);
        fill(noteColor, noteAlpha*0.6f);

        for (int i = 0; i < heights.size(); i++) {
          float bottom = currentHeights.get(i);
          float top = heights.get(i) + bottom;
          rect(myX + i*w, myY+myHeight-bottom*4, myX + i*w + w, myY + myHeight - (top*4));
          currentHeights.set(i, top);
        }
      }
    }
  }

  public void setCurrentInstrument(Instrument newIns) {
    instrument = newIns;
  }
}
  
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
  setUpdateRed();
  //setInstrumentScale(instrumentDroplist.getSelectedText(), noteDroplist.getSelectedText(), scaleDroplist.getSelectedText()); 

} //_CODE_:scaleDroplist:707967:

public void noteDroplist_click1(GDropList source, GEvent event) { //_CODE_:noteDroplist:670313:
  setUpdateRed();
  //setInstrumentScale(instrumentDroplist.getSelectedText(), noteDroplist.getSelectedText(), scaleDroplist.getSelectedText()); 
} //_CODE_:noteDroplist:670313:

public void instrumentDroplist_click1(GDropList source, GEvent event) { //_CODE_:instrumentDroplist:276246:
  setUpdateRed();
  //setInstrumentScale(instrumentDroplist.getSelectedText(), noteDroplist.getSelectedText(), scaleDroplist.getSelectedText()); 
} //_CODE_:instrumentDroplist:276246:

public void updateButton_click1(GButton source, GEvent event) { //_CODE_:updateButton:231287:
  if(event == GEvent.PRESSED) {
    setUpdateCustom();
    setInstrumentScale(instrumentDroplist.getSelectedText(), noteDroplist.getSelectedText(), scaleDroplist.getSelectedText()); 
  }
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
} //_CODE_:helpPanel:363142:

public void textarea2_change1(GTextArea source, GEvent event) { //_CODE_:textarea2:658800:
} //_CODE_:textarea2:658800:

public void playHighlightedNotes_click1(GButton source, GEvent event) { //_CODE_:playHighlightedNotes:422701:
  HashMap<String,Integer> currentlyPlaying = musicMaker.getCurrentlyPlayingNotes();
  for(String note : currentlyPlaying.keySet()) {
    currentInstrument.playNote(note);
  }
} //_CODE_:playHighlightedNotes:422701:



// Create all the GUI controls. 
// autogenerated do not edit
public void createGUI(){
  G4P.messagesEnabled(false);
  G4P.setGlobalColorScheme(GCScheme.CYAN_SCHEME);
  G4P.setCursor(ARROW);
  if(frame != null)
    frame.setTitle("Sketch Window");
  instrumentDroplist = new GDropList(this, 470, 20, 120, (4+1)*18, 4);
  instrumentDroplist.setItems(loadStrings("list_276246"), 0);
  instrumentDroplist.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  instrumentDroplist.addEventHandler(this, "instrumentDroplist_click1");
  noteDroplist = new GDropList(this, 470, 50, 120, (12+1)*18, 12);
  noteDroplist.setItems(loadStrings("list_670313"), 3);
  noteDroplist.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  noteDroplist.addEventHandler(this, "noteDroplist_click1");
  scaleDroplist = new GDropList(this, 470, 80, 120, (5+1)*18, 5);
  scaleDroplist.setItems(loadStrings("list_707967"), 0);
  scaleDroplist.setLocalColorScheme(GCScheme.BLUE_SCHEME);
  scaleDroplist.addEventHandler(this, "scaleDroplist_click1");
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

  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "MusicWheel" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
