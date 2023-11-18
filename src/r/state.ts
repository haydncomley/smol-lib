export function isSmolValue(object: unknown): object is SmolValue<unknown> {
    if(typeof object !== 'object' || !object) return false;

    if('get' in object) {
        return true;
    }

    return false;
}

export interface SmolValue<T> {
    index: number;
    deps: SmolValue<T>[];
    get(): T;
    runs?: number;
}

export interface State {
    root: HTMLElement;
    seed: number;
    values: SmolValue<unknown>[];
    bindings: Record<string, SmolValue<unknown>>;
    onChange: (updatedIndex: SmolValue<unknown>) => void;
}

export interface GlobalState { [key: string]: SmolValue<unknown>[] }

export function setupState(component: HTMLElement, changeCallback: State['onChange']) {
    const state: State = {
        root: component,
        seed: 0,
        values: [],
        bindings: {},
        onChange: changeCallback
    };

    
    window['smol-last-state'] = state;
    if (!window['smol-global-state']) window['smol-global-state'] = {};
    if (!window['smol-global-comsumers']) window['smol-global-comsumers'] = { seed: 0 }
    return state;
}

export function value<T>(initialValue: T) {
    const state = window['smol-last-state'] as State;
    const index = state.seed++;
    const exists = state.values[index] as SmolValue<T> | undefined;

    let internalValue = !exists ? initialValue : exists.get();

    const internal = {
        index,
        deps: [],
        get: (): T => internalValue,
        set: (val: T) => {
            internalValue = val;
            state.onChange(internal);
            state.values
                .filter(v => v.deps.find((x) => x.index === index))
                .forEach(b => state.onChange(b));
        }
    };

    if (!exists) state.values.push(internal);
    else state.values[index] = internal;

    return internal;
}

export function compute<T>(transform: () => T, dependencies: SmolValue<T>[] = []) {
    const state = window['smol-last-state'] as State;
    const index = state.seed++;
    const exists = state.values[index] as SmolValue<T> | undefined;

    const internal = {
        index,
        runs: exists?.runs ?? 0,
        deps: dependencies,
        get: (): T => {
            state.values[index].runs = (state.values[index].runs ?? 0) + 1;
            return transform();
        },
    };

    if (!exists) state.values.push(internal);
    else state.values[index] = internal;

    return internal;
}

export function sharedValue<T>(key: string, initialValue: T) {
    const globalState = window['smol-global-state'];
    const globalExists = globalState[key] as SmolValue<T> | undefined;

    let internalValue = !globalExists ? initialValue : globalExists.get();
    const localValue = value(internalValue);

    if(!globalExists) {
        globalState[key] = {
            index: 0,
            deps: [],
            get: (): T => internalValue,
            set: (val: T) => {
                internalValue = val;
                console.log('setting global value', key, val);
                globalState[key].deps.forEach((dep) => (dep as any).set(val));
            }
        } as SmolValue<T>
    };

    globalState[key].deps.push(localValue);

    return globalState[key];
}