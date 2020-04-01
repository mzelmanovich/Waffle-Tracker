import { html, render, TemplateResult } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';

export default abstract class Component {
    protected readonly html = html;
    protected readonly repeatHtml = repeat;

    protected abstract get template(): TemplateResult;
    protected abstract get container(): Element;

    render() {
        render(this.template, this.container);
    }

    append() {
        const childContainer = document.createElement('div');
        render(this.template, childContainer);
        this.container.appendChild(childContainer);
    }
}
