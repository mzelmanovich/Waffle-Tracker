import { Pattern } from "./pattern";


export interface AudioContextI {
    currentTime: number;
    createBufferSource: ()=> AudioBufferSourceNodeI;
    destination: AudioDestinationNodeI;
    decodeAudioData: (buffer: ArrayBuffer) => Promise<AudioBuffer>;
}

export interface AudioBufferSourceNodeI {
    buffer?: AudioBuffer;
    connect: (dest: AudioDestinationNodeI) => AudioNodeI;
    start: (timestamp?: number) => void
}

export interface AudioDestinationNodeI {

}

export interface AudioNodeI {

}

/**
 * Holds AudioContext. Use to play sounds through the browser
 */
export class Song {
    private patterns: Array<Pattern> = [];
    private readonly processTime = 0.200;
    
    constructor(public bpm: number = 60, readonly audioContext: AudioContextI= (new AudioContext())) {}

    /**
     * Adds a pattern to song at the given index.
     */
    addPattern(pat: Pattern, index?: number) {
        if (Number.isInteger(index)) {
           
            // check index is within bounds
            if(index < 0 || index > this.length) {
                throw new Error(`Index given for pattern, ${index}, is out of bounds. Track currently has ${this.length} patterns.`);
            }

            this.patterns[index] = pat;
        } else {
            this.patterns.push(pat);
        }
    }

    /**
     * How many patterns are within the song. 
     */
    get length() {
        return this.patterns.length;
    }

    /**
     * How many patterns are within the song. 
     */
    set length(num: number) {
        this.patterns.length = num;
    }

    getPattern(index: number) {
        // check index is within bounds
        if(index < 0 || index >= this.length) {
            throw new Error(`Index given for pattern, ${index}, is out of bounds. Track currently has ${this.length} patterns.`);
        }
        return this.patterns[index];
    }

    /**
     * Starts all tracks within pattern at the given timestamp within the song.
     */
    async play() {
        let nextNoteTS = this.audioContext.currentTime + this.processTime;;
        for(let i = 0; i < this.length; i++) {
            const pat = this.patterns[i];
            nextNoteTS = await pat.play(nextNoteTS);
        }
    }
}