import { Track } from "./track";
import { start } from "repl";

export class Pattern {
    private tracks: Array<Track> = [];
    private _reps = 1;

    /** How many times should the pattern repeat. */
    get reps(){
        return this._reps;
    }
    /**
     * How many times should the pattern repeat.
     */
    set reps(num: number) {
        if (num < 1) {
            throw new Error(`Patterns must repeate at least once. ${num} is not allowed.`);
        }
        this._reps = num;
    }


    /**
     * Adds a track to the pattern at the given index.
     */
    addTrack(track: Track, index?: number) {
        if (Number.isInteger(index)) {
           
            // check index is within bounds
            if(index < 0 || index > this.length) {
                throw new Error(`Index given for track, ${index}, is out of bounds. Pattern currently has ${this.length} tracks.`);
            }

            this.tracks[index] = track;
        } else {
            this.tracks.push(track);
        }
    }

    /**
     * How many tracks are within the pattern. 
     */
    get length() {
        return this.tracks.length;
    }

    /**
     * How many tracks are within the pattern. 
     */
    set length(num: number) {
        this.tracks.length = num;
    }

    /**
     * Starts all tracks wihtin pattern at given timestamp
     * 
     * @param  {number} timestamp When to start playing all tracks within pattern in seconds.
     * @returns Timesteamp in seconds of next time to start next note out of all played tracks
     */
    private async playAllTracks(timestamp: number) {
        let maxTSFound = 0;
        for(let i = 0; i < this.length; i++) { // trackloop
            const track = this.tracks[i];
            const trackTS = await track.play(timestamp);

            // find when next track that wants the longest next note
            if (trackTS > maxTSFound) {
                maxTSFound = trackTS;                    
            }
        }
        return maxTSFound;
    }


    /**
     * Starts all tracks within pattern at the given timestamp within the song and repeats if needed.
     * 
     * @param  {number} timestamp When to start playing pattern in seconds within song.
     * @returns Timesteamp in seconds of next time to start next note out of all played patterns
     */
    async play(timestamp: number) {
        let startNextPat = timestamp;
        for(let i= 1; i<= this.reps; i++) {
            startNextPat = await this.playAllTracks(startNextPat);
        }

        return startNextPat;
    }
    
}