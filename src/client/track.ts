import { WebNote } from "./notes";
import { Song } from "./song";

export class Track {

    private notes: Array<WebNote> = [];
    
    constructor (private song: Song, length?: number) {
        this.notes.length =length ?? 16;
    };

    /**
     * How many notes are within the track. 
     */
    get length() {
        return this.notes.length;
    }
    /**
     * Adds a note to the song at a given index.
     */
    addNote(note: WebNote, index?:number) {
        if (Number.isInteger(index)) {
            this.notes[index] = note;
        } else {
            this.notes.push(note);
        }
    }
    /**
     * @param  {number} length Preset how many notes the track should contain. Defaults to 16.
     */
    reset(length: number=16) {
        this.notes = [];
        this.notes.length = length;
    }

    // TODO: Do not hardcode track into 16th notes
    private calculateNoteTime() {
        const beat = 60 / this.song.bpm;
        return beat / 4;
    }

    private get nextNoteTimestampOffset() {
        return this.calculateNoteTime() * this.length;
    }
    
    /**
     * Calculates when each note with the track should play and starts them.
     * 
     * @param  {number} timestamp Second timestamp of where to start playing track in song.
     * @returns Timesteamp in seconds of next note start to start
     */
    async play(timestamp: number) {
        const noteTime =  this.calculateNoteTime();
        for(let i = 0; i < this.length; i++) {
            const note = this.notes[i];
            if (note) {
                await note.play(timestamp + (i * noteTime));
            }
        }
        return timestamp + this.nextNoteTimestampOffset;
    }

}