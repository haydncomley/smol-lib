import { element, render } from "./rendering";
import { SmolValue, State, compute, setupState, value } from "./state";

export class Component extends HTMLElement {
    renderFunc: () => string;
    isDirty: SmolValue<unknown>[] = [];
    root = this;

    constructor(func: () => ReturnType<typeof render>) {
        super();
        // this.root = this.attachShadow({ mode: 'open' }) as any;

        const state = setupState(this, (val) => {
            window['smol-last-state'] = state;
            window['smol-global-comsumers'].seed = 0;
            state.seed = 0;

            if (this.isDirty.length === 0) {
                requestAnimationFrame(() => {
                    // this.isDirty.forEach((dirtyVal) => dirtyVal.get());
                    this.doRender();
                    this.isDirty = [];
                    state.values
                        .filter((val) => typeof val.runs !== 'undefined')
                        .filter((val) => val.deps.length === 0)
                        .forEach((val) => val.get());
                });
            }
            this.isDirty.push(val);
        });
        this.renderFunc = func();
        this.doRender();
        state.values.forEach((val) => {
            if (val.runs === 0) val.get();
        })
    }

    doRender() {
        const s = this.renderFunc();
        const div = document.createElement('div');
        div.innerHTML = s;
        const persistElementsOld = Array.from(this.querySelectorAll('[data-persist]'))
        const persistElementsNew = Array.from(div.querySelectorAll('[data-persist]'))
        const refocusElement = document.activeElement;

        persistElementsNew.forEach((newElement) => {
            const oldElement = persistElementsOld.find((oldElement) => oldElement.getAttribute('data-persist') === newElement.getAttribute('data-persist'));
            if (oldElement) {
                newElement.replaceWith(oldElement);
            }
        });

        this.root.replaceChildren(...div.children as any);
        if(refocusElement) (refocusElement as any)?.focus();
    }
}

export function component(tag: string, func: () => ReturnType<typeof render>) {
    if (customElements.get(tag)) {
        console.warn(`Component with tag '${tag}' is already defined.`);
        return;
    }

    customElements.define(tag, class extends Component {
        constructor() {
            super(func);
        }
    });
}

export function listen<T extends Event>(selector: string, event: string, callback: (event: T) => void) {
    const rootElement = element();
    compute(() => {
        const element = rootElement.querySelector(selector);
        if(element) element.addEventListener(event, callback as any);
        else console.warn(`Could not find element with selector '${selector}'`);
    });
}

export function bind(selector: string, key: string, val: SmolValue<unknown>) {
    const rootElement = element();
    compute(() => {
        const element = rootElement.querySelector(selector);
        if(element) element[key] = val.get();
        else console.warn(`Could not find element with selector '${selector}'`);
    }, [val]);
}

export function input(selector: string, val: SmolValue<unknown>, callback?: () => void) {
    bind(selector, 'value', val);
    listen(selector, 'input', (e) => {
        (val as any).set((e.target as any).value);
        if (callback) callback();
    });
}

export function provide<T>(key: string, val: SmolValue<T>) {
    const rootElement = element();
    if (!rootElement['smol-provide-state']) rootElement['smol-provide-state'] = {};
    rootElement['smol-provide-state'][key] = val;
}


export function consume<T>(key: string): SmolValue<T> {
    const localKey = `consumer-key-${key}-${window['smol-global-comsumers'].seed++}`;

    const checkParent = (element: HTMLElement) => {
        if (element['smol-provide-state']) {
            return element['smol-provide-state'][key];
        } else if (element.parentElement) {
            return checkParent(element.parentElement);
        }
    }

    
    const root = element();
    const val = checkParent(root);
    window['smol-global-comsumers'][localKey] = val?.get() || window['smol-global-comsumers'][localKey];
    const localVal = value<T>(window['smol-global-comsumers'][localKey] as T);

    setTimeout(() => {
        const val = checkParent(root);
        window['smol-global-comsumers'][localKey] = val.get();
        localVal.set(window['smol-global-comsumers'][localKey] as T);
    })

    return localVal;
}