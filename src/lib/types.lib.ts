export type ComponentOptionsCallback<T> = (callback: T) => void;

export type ComponentVariable<T> = {
    id: number,
    get: () => T extends (() => void) ? ReturnType<T> : T,
    set: ComponentOptionsCallback<(prevValue: T) => T>,
}

export type ComponentOptions = {
    use: <T>(value: T, deps?: ComponentVariable<any>[]) => ComponentVariable<T>,
    arg: <T, K>(key: string, transformer?: (value: T) => K, initial?: T) => ComponentVariable<typeof transformer extends undefined ? T : K>,
    on: {
        create: () => void
    },
    element: ShadowRoot,
    rootElement: HTMLElement,
};

export type ComponentSettings = {
    styles?: string
}

export type ComponentRenderOptions = {
    render: (component: TemplateStringsArray, ...args: unknown[]) => ComponentBlock,
    _if: (condition: ComponentVariable<any>, render: () => ComponentBlock) => ComponentBlock
    _for: <T>(condition: ComponentVariable<T>, render: (val: T extends (infer Item)[] ? Item : T, index: number) => ComponentBlock) => ComponentBlock,
    _class: (classes: { [key: string]: ComponentVariable<any> }) => ComponentBlock,
    _bind: (value: ComponentVariable<any>, backBindValue?: ComponentVariable<any>) => ComponentBlock,
};

export type ComponentBlock = {
    items: (Node | null)[]
    eval?: ComponentVariable<any>;
    evalRender?: (() => ComponentBlock) | ((val: unknown, index: number) => ComponentBlock);
    evalType?: 'if' | 'for' | 'class' | 'bind';
}