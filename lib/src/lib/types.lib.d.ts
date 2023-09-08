export type ComponentOptionsCallback<T> = (callback: T) => void;
export type ComponentVariable<T> = {
    id: number;
    get: () => T extends (() => void) ? ReturnType<T> : T;
    set: ComponentOptionsCallback<T | ((prevValue: T) => T)>;
};
export type ComponentEvent<T> = Omit<ComponentVariable<T>, 'set'>;
export type ComponentOptions = {
    use: <T>(value: T, deps?: ComponentVariable<any>[]) => ComponentVariable<T>;
    arg: <T, K>(key: string, options: {
        transformer?: (value: T) => K;
        initial?: K;
    }) => ComponentVariable<typeof options['transformer'] extends undefined ? T : K>;
    store: <T, K>(key: string, options: {
        transformer?: (value: T) => K;
        initial?: K;
    }) => ComponentVariable<typeof options['transformer'] extends undefined ? T : K>;
    action: <T extends Event>(callback: (event: T extends never ? Event : T) => void) => ComponentEvent<{
        type: 'BIND';
        event: (event: T) => void;
    }>;
    on: {
        create: () => void;
    };
    element: ShadowRoot;
    rootElement: HTMLElement;
};
export type ComponentSettings = {
    styles?: string;
};
export type ComponentRenderOptions = {
    render: (component: TemplateStringsArray, ...args: unknown[]) => ComponentBlock;
    _if: (condition: ComponentVariable<any>, render: () => ComponentBlock) => ComponentBlock;
    _for: <T>(condition: ComponentVariable<T>, render: (val: T extends (infer Item)[] ? Item : T, index: number) => ComponentBlock) => ComponentBlock;
    _class: (classes: {
        [key: string]: ComponentVariable<any>;
    }) => ComponentBlock;
    _echo: (variable: ComponentVariable<any>) => ComponentBlock;
    _bind: (value: ComponentVariable<any>, settings?: {
        serialise?: boolean;
    }) => ComponentBlock;
};
export type ComponentBlock = {
    items: (Node | null)[];
    eval?: ComponentVariable<any>;
    evalRender?: (() => ComponentBlock) | ((val: unknown, index: number) => ComponentBlock);
    evalType?: 'if' | 'for' | 'class' | 'bind' | 'echo';
};
