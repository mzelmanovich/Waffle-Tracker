import { Song } from './song';

/**
 * Represent a note created from a audio file url.
 */
export class WebNote {
    private audioBuffer_: Promise<AudioBuffer>;
    private source: AudioBufferSourceNode | null = null;

    constructor(private url: string, private song: Song) {
        this.fetchData();
    }

    set audioBuffer(obj: Promise<AudioBuffer>) {
        if (!this.audioBuffer_) {
            this.audioBuffer_ = obj;
        }
    }

    get audioBuffer() {
        return this.audioBuffer_;
    }

    private async fetchData() {
        const response = await fetch(this.url);
        const dataBuffer = await response.arrayBuffer();
        this.audioBuffer = this.song.audioContext.decodeAudioData(dataBuffer);
    }

    /**
     * Plays note in given song.
     *
     * @param timestamp  When to play note in seconds within song.
     */
    async play(timestamp: number) {
        this.source = this.source ?? this.song.audioContext.createBufferSource();
        this.source.buffer = await this.audioBuffer;
        this.source.connect(this.song.audioContext.destination);
        this.source.start(timestamp);
    }

    /**
     * Stop playing note if playing at giving TS
     *
     * @param timestamp When to stop note in seconds within song.
     */
    stop(timestamp: number) {
        this.source?.stop(timestamp);
    }
}
