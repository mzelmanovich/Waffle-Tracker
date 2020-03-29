import { Song } from "./song";
import { WebNote } from "./notes";
import { Track } from "./track";
import { Pattern } from "./pattern";

const KICK_URL = 'https://webaudioapi.com/samples/rhythm/kick.wav';
const SNARE_URL = 'https://webaudioapi.com/samples/rhythm/snare.wav';
const HI_HAT_URL = 'https://webaudioapi.com/samples/rhythm/hihat.wav';

// new prototype example 1.0 
const song = new Song(120);
const pattern = new Pattern();
pattern.reps = 2;
const track0 = new Track(song);
const track1 = new Track(song);
const track2 = new Track(song);
const track3 = new Track(song);
const k = new WebNote(KICK_URL, song);
const h = new WebNote(HI_HAT_URL, song);
const s = new WebNote(SNARE_URL, song);
song.addPattern(pattern);
pattern.addTrack(track0);
pattern.addTrack(track1);
pattern.addTrack(track2);
pattern.addTrack(track3);

const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');

const inputs = document.getElementsByTagName("input");

for (let i = 0; i < inputs.length; i++) { 
    let n: any = inputs[i];
    let cell = n.classList[1]
    n.addEventListener("input", function() {
        let note: any = inputs[i].value;
        if (note) {
            let trackNumber: any = inputs[i];
            while(trackNumber.className != 'trackColumn'){
                trackNumber = trackNumber.parentElement;
            }
            trackNumber = trackNumber.id;
            console.log(trackNumber, note, cell);
            track0.addNote(k, cell);
        }
      });
}

playButton.onclick = () => song.play(); 


/*
// example 0.2
const oldPlayButton = document.getElementById('button-old');
const newPlayButton = document.getElementById('button-new');
const oldSong = new Song(80);
const kickNote = new WebNote(KICK_URL, oldSong);
const hiHatNote = new WebNote(HI_HAT_URL, oldSong);
const snareNote = new WebNote(SNARE_URL, oldSong);
const kickTrack = new Track(oldSong);
const hiHatTrack = new Track(oldSong);
const snareTrack = new Track(oldSong);
const pat = new Pattern();
pat.reps = 2;

hiHatTrack.addNote(hiHatNote, 0);
hiHatTrack.addNote(hiHatNote, 2);
hiHatTrack.addNote(hiHatNote, 4);
hiHatTrack.addNote(hiHatNote, 6);
hiHatTrack.addNote(hiHatNote, 8);
hiHatTrack.addNote(hiHatNote, 10);
hiHatTrack.addNote(hiHatNote, 12);
hiHatTrack.addNote(hiHatNote, 14);

kickTrack.addNote(kickNote, 0);
kickTrack.addNote(kickNote, 4);
kickTrack.addNote(kickNote, 8);
kickTrack.addNote(kickNote, 12);
snareTrack.addNote(snareNote, 14);


pat.addTrack(hiHatTrack);
pat.addTrack(kickTrack);
pat.addTrack(snareTrack);

oldSong.addPattern(pat);

newPlayButton.onclick = () => oldSong.play();

/*
// example 0.1
const context = new AudioContext();
const oldPlayButton = document.getElementById('button-old');
const newPlayButton = document.getElementById('button-new');

async function getBuffer(url: string) {
    const arrayBuffer = (await fetch(url)).arrayBuffer();
    return await context.decodeAudioData(await arrayBuffer);
}

class Instrument {
    constructor(private buffer: AudioBuffer) {
    }

     start(time: number) {
        const source = context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(context.destination);
        source.start(time);
    }
}

oldPlayButton.onclick =  () =>  play();

async function play() {
    const kick = new Instrument(await getBuffer(KICK_URL));
    const snare = new Instrument(await getBuffer(SNARE_URL));
    const hihat = new Instrument(await getBuffer(HI_HAT_URL));
    var tempo = 80; // BPM (beats per minute)
    var quarter = 60 / tempo;
    var eightNoteTime = quarter / 2;
    const startTime = context.currentTime + 0.100;

    // TODO: optimize this
    // Play 2 bars of the following:
    for (var bar = 0; bar < 2; bar++) {
        const time = startTime  + (bar * 8 * eightNoteTime);
        hihat.start(time);
        hihat.start(time + (1 * eightNoteTime)) ;
        hihat.start(time + (2 * eightNoteTime)) ;
        hihat.start(time + (3 * eightNoteTime)) ;
        hihat.start(time + (4 * eightNoteTime)) ;
        hihat.start(time + (5 * eightNoteTime)) ;
        hihat.start(time + (6 * eightNoteTime)) ;
        hihat.start(time + (7 * eightNoteTime)) ;
        kick.start(time);
        kick.start(time + (2 * eightNoteTime)) ;
        kick.start(time + (4 * eightNoteTime)) ;
        kick.start(time + (6 * eightNoteTime)) ;
        snare.start(time+ (7 * eightNoteTime));
    }
}
*/