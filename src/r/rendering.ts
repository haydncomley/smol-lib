import { SmolValue, State, isSmolValue } from "./state";

export function render(template: TemplateStringsArray, ...args: (unknown | SmolValue<unknown>)[]) {
    const renderTemplate = () => {
        let string = '';

        template.forEach((block, index) => {
            const nextVar = args[index];
            string += block;
            if (nextVar === undefined) return;
            string += isSmolValue(nextVar) ? nextVar.get() : String(nextVar);
        });

        return string;
    }

    return renderTemplate;
}

export function element(): HTMLElement {
    const state: State = window['smol-last-state'];
    return state?.root;
}