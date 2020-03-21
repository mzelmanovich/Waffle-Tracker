import {Song} from './song';

/**
 * Represent a note created from a audio file url.
 */
export class WebNote  {
    private audioBuffer: Promise<AudioBuffer>;

    constructor(private url: string, private song: Song) {
        this.fetchData();
    }

    private async fetchData() {
        const response = await fetch(this.url);
        const dataBuffer = await response.arrayBuffer();
        this.audioBuffer = this.song.audioContext.decodeAudioData(dataBuffer);
    }

    /**
     * Plays note in given song.
     * 
     * @param timestamp Second timestamp of where to play note in song.
     */
    async play (timestamp: number) {
        const source =  this.song.audioContext.createBufferSource();
        source.buffer = await this.audioBuffer;
        source.connect(this.song.audioContext.destination);
        source.start(timestamp);
    }
}