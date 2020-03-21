import { Sequence } from "./sequence";

/**
 * Holds AudioContext. Use to play sounds through the browser
 */
export class Song {
    readonly audioContext = new AudioContext();
    private seqs: Array<Sequence> = [];
    private readonly processTime = 0.200;
    
    constructor(public bpm: number = 60) {}

    /**
     * Adds a sequence to song at the given index.
     */
    addSequence(seq: Sequence, index?: number) {
        if (Number.isInteger(index)) {
           
            // check index is within bounds
            if(index < 0 || index > this.length) {
                throw new Error(`Index given for sequence, ${index}, is out of bounds. Track currently has ${this.length} sequences.`);
            }

            this.seqs[index] = seq;
        } else {
            this.seqs.push(seq);
        }
    }

    /**
     * How many sequences are within the sequnce. 
     */
    get length() {
        return this.seqs.length;
    }

    /**
     * How many sequences are within the sequnce. 
     */
    set length(num: number) {
        this.seqs.length;
    }

    /**
     * Starts all tracks within sequence at the given timestamp within the song.
     */
    async play() {
        let nextNoteTS = this.audioContext.currentTime + this.processTime;;
        for(let i = 0; i < this.length; i++) {
            const seq = this.seqs[i];
            nextNoteTS = await seq.play(nextNoteTS);
        }
    }
}