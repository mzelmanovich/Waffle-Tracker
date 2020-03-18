// import { Url } from "./url";

export class AudioData {
    buffer: Promise<ArrayBuffer>;

    constructor(private url: string) {
        this.fetchData();
    }

    private async fetchData() {
        const response = await fetch(this.url.toString());
         this.buffer = response.arrayBuffer();
    }
}