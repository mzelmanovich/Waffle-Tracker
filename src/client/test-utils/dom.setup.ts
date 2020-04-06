import { TemplateResult, render } from 'lit-html';

export let appContainter = document.getElementById('app');

beforeEach(() => {
    if (!appContainter) {
        const appDiv = document.createElement('div');
        appDiv.id = 'app';
        document.body.prepend(appDiv);
        appContainter = appDiv;
    }
});

afterEach(() => {
    appContainter.innerHTML = '';
});

export const testRender = (template: TemplateResult) => render(template, appContainter);
