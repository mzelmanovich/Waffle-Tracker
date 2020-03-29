import { WebNote } from './notes';
import { Song } from './song';

const noteResolution = 16;

export class Track {
    private notes: Array<WebNote> = [];

    constructor(private song: Song, length: number = noteResolution) {
        this.notes.length = length;
    }

    /**
     * How many notes are within the track.
     */
    get length() {
        return this.notes.length;
    }

    set length(length: number) {
        this.notes.length = length;
    }
    /**
     * Adds a note to the song at a given index.
     */
    addNote(note: WebNote, index?: number) {
        if (Number.isInteger(index)) {
            this.notes[index] = note;
        } else {
            this.notes.push(note);
        }
    }

    getNote(index: number) {
        if (index < 0 || index >= this.length) {
            throw new Error(
                `Index given for note, ${index}, is out of bound. Track currently has ${this.length} notes`,
            );
        }
        return this.notes[index] || null;
    }

    /**
     * @param  {number} length Preset how many notes the track should contain. Defaults to 16.
     */
    reset(length: number = noteResolution) {
        this.notes = [];
        this.notes.length = length;
    }

    // TODO: Do not hardcode track into 16th notes
    private calculateNoteTime() {
        const secondsPerNote = 60 / this.song.bpm;
        return secondsPerNote / 4;
    }

    private get nextNoteTimestampOffset() {
        return this.calculateNoteTime() * this.length;
    }

    /**
     * Calculates when each note with the track should play and starts them.
     *
     * @param  {number} timestamp When to start playing track in seconds within song.
     * @returns Timesteamp in seconds of next note start to start
     */
    async play(timestamp: number) {
        const noteTime = this.calculateNoteTime();
        for (let i = 0; i < this.length; i++) {
            const note = this.notes[i];
            if (note) {
                await note.play(timestamp + i * noteTime);
            }
        }
        return timestamp + this.nextNoteTimestampOffset;
    }
}
