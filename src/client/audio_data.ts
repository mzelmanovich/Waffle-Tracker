import { Url } from "./url";

export class AudioData {
    private buffer: Promise<ArrayBuffer>;

    constructor(private url: Url) {
        this.fetchData();
    }

    private async fetchData() {
        const response = await fetch(this.url.toString());
         this.buffer = response.arrayBuffer();
    }
}