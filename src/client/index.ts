const KICK_URL = 'https://webaudioapi.com/samples/rhythm/kick.wav';
const SNARE_URL = 'https://webaudioapi.com/samples/rhythm/snare.wav';
const HI_HAT_URL = 'https://webaudioapi.com/samples/rhythm/hihat.wav'

const context = new AudioContext();
const playButton = document.getElementById('button');

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

playButton.onclick =  () =>  play();

async function play() {
    const kick = new Instrument(await getBuffer(KICK_URL));
    const snare = new Instrument(await getBuffer(SNARE_URL));
    const hihat = new Instrument(await getBuffer(HI_HAT_URL));
    var tempo = 80; // BPM (beats per minute)
    var quarter = 60 / tempo;
    var eightNoteTime = quarter / 2;
    const startTime = context.currentTime + 0.100;


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
    }
}
