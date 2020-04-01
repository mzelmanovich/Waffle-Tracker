import Component from './component';

export default class Track extends Component {
    constructor(public readonly index: number) {
        super();
    }

    private get trackRows() {
        return this.repeatHtml(new Array(16), (i, index) => {
            let indexString = index.toString();
            indexString = indexString.length == 1 ? '0' + indexString : indexString;

            return this.html`
            <div class="trackRow">
                <div class="rowNote">
                    <label for="${indexString}">${indexString}</label>
                    <input type="text" name="${indexString}"
                    data-note-index="${indexString}"
                    data-track-index="${this.index}">
                </div>
            </div>
            `;
        });
    }

    protected get template() {
        return this.html`
        <div class="trackColumn">
            <div class="trackHeader">Track ${this.index}</div>
            ${this.trackRows}
        </div>
        `;
    }

    protected get container(): Element {
        return document.getElementById('tracks');
    }
}
