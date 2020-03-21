import { Track } from "./track";
import { start } from "repl";

export class Sequence {
    private tracks: Array<Track> = [];
    private _repeat = 1;

    /** How many times should the sequence repeat. */
    get repeat(){
        return this._repeat;
    }
    /**
     * How many times should the sequence repeat.
     */
    set repeat(num: number) {
        if (num < 1) {
            throw new Error(`Sequnces must repeate at least once. ${num} is not allowed.`);
        }
        this._repeat = num;
    }


    /**
     * Adds a track to sequnce at the given index.
     */
    addTrack(track: Track, index?: number) {
        if (Number.isInteger(index)) {
           
            // check index is within bounds
            if(index < 0 || index > this.length) {
                throw new Error(`Index given for track, ${index}, is out of bounds. Sequence currently has ${this.length} tracks.`);
            }

            this.tracks[index] = track;
        } else {
            this.tracks.push(track);
        }
    }

    /**
     * How many tracks are within the sequnce. 
     */
    get length() {
        return this.tracks.length;
    }

    /**
     * How many tracks are within the sequnce. 
     */
    set length(num: number) {
        this.tracks.length = num;
    }

    /**
     * Starts all tracks wihtin seq at given timestamp
     * 
     * @param  {number} timestamp Second timestamp of where to start playing sequence in song.
     * @returns Timesteamp in seconds of last note start out of all played tracks
     */
    private async playAllTracks(timestamp: number) {
        let maxTSFound = 0;
        for(let i = 0; i < this.length; i++) { // trackloop
            const track = this.tracks[i];
            const trackTS = await track.play(timestamp);

            // find when last note within track is played
            if (trackTS > maxTSFound) {
                maxTSFound = trackTS;                    
            }
        }
        return maxTSFound;
    }


    /**
     * Starts all tracks within sequence at the given timestamp within the song and repeats if needed.
     * 
     * @param  {number} timestamp Second timestamp of where to start playing sequence in song.
     * @returns Timesteamp in seconds of last note start out of all played sequences
     */
    async play(timestamp: number) {
        let startNextSeq = timestamp;
        for(let i= 1; i<= this.repeat; i++) {
            startNextSeq = await this.playAllTracks(startNextSeq);
        }

        return startNextSeq;
    }
    
}