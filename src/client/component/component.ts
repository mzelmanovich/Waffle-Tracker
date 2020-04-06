import { html, render as litrender, TemplateResult, DirectiveFn } from 'lit-html';
import { repeat, ItemTemplate, KeyFn } from 'lit-html/directives/repeat';
import { Application, Controller, ControllerConstructor } from 'stimulus';

const app = Application.start();

const camelToDash = (str: string) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

interface HtmlFunction {
    (strings: TemplateStringsArray, ...values: unknown[]): TemplateResult;
}

interface AttrFunctions {
    action(eventmap: { [eventName: string]: string }): string;
    target(name: string): string;
}

interface HtmlHelpers {
    repeat<T>(items: Iterable<T>, keyFnOrTemplate: KeyFn<T> | ItemTemplate<T>, template?: ItemTemplate<T>): DirectiveFn;
    rangeRepeat(max: number, templateFunction: (index: number) => TemplateResult): DirectiveFn;
}

interface TemplateCreationFunction<T> {
    (html: HtmlFunction, data: T, attr: AttrFunctions, helpers: HtmlHelpers): TemplateResult;
}

export const render = (template: TemplateResult, container: Element) => litrender(template, container);

/**
 * HTML components that uses lit-html to create html and stimulusjs for events.
 */
export abstract class Component extends Controller {
    /** lit-html's html function. */
    protected html = html;
    /** lit-html's repeat function. */
    protected repeat = repeat;
    static template: (data: unknown) => TemplateResult;

    static get controllerName(): string {
        return camelToDash(this.name);
    }

    static registered: boolean;

    static register() {
        if (!this.registered) {
            app.register(this.controllerName, (this as unknown) as ControllerConstructor);
        }
    }

    static dataAttr(key: string, value: { toString: () => string }) {
        return `data-${this.controllerName}-${camelToDash(key)}="${value.toString()}"`;
    }

    static get controllerAttr() {
        return `data-controller="${this.controllerName}"`;
    }

    static makeEventKey(eventName: string, methodName: string) {
        return `${eventName}->${this.controllerName}#${methodName}`;
    }

    static actionAttr(eventmap: { [eventName: string]: string }) {
        let actionVal = '';
        for (const eventName of Object.keys(eventmap)) {
            const methodName = eventmap[eventName];
            actionVal += `${actionVal.length ? ' ' : ''}${this.makeEventKey(eventName, methodName)}`;
        }

        return `data-action="${actionVal}"`;
    }

    static targetAttr(name: string) {
        return `data-target="${this.controllerName}.${name}"`;
    }

    /**
     * Helper fucntion to create templates
     *
     * @param  fnc Function to excute with helper injected in.
     * @param  data Data to use within fnc
     */
    static createTemplate<T>(data: T, fnc: TemplateCreationFunction<T>) {
        const action = this.actionAttr.bind(this);
        const target = this.targetAttr.bind(this);
        const rangeRepeat = this.rangeRepeat.bind(this);
        const createdTemplate = fnc(html, data, { action, target }, { rangeRepeat, repeat });
        return html`<div ${this.controllerAttr}>${createdTemplate}</div>`;
    }

    /**
     * Repeates a given template max times.
     */
    static rangeRepeat(times: number, templateFunction: (index: number) => TemplateResult) {
        return repeat(new Array(times), (i, index) => templateFunction(index));
    }
}
