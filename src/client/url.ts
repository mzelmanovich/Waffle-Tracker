/**
 * Class that represents a url and performs validation
 */
export class Url extends String {

    constructor(private urlString: string) {
        super(urlString);
    }

    public toString() {
        return this.urlString;
    }
}