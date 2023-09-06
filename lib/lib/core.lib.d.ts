import { ComponentBlock, ComponentOptions, ComponentRenderOptions, ComponentSettings, ComponentVariable } from "./types.lib.js";
export declare const createHTML: (store: unknown[], bindings: ((newValue: any) => void)[][], component: TemplateStringsArray, ...args: unknown[]) => ComponentBlock;
export declare const createComponent: (tag: string, func: (options: {
    $: ComponentOptions;
}) => (renderOptions: ComponentRenderOptions) => ComponentBlock, settings?: ComponentSettings | string) => void;
export declare const createComponentLogic: (root: ShadowRoot, func: (options: {
    $: ComponentOptions;
}) => (renderOptions: ComponentRenderOptions) => ComponentBlock) => {
    componentArgStore: {
        [key: string]: ComponentVariable<any>;
    };
    componentStore: unknown[];
    componentStoreBindings: (() => void)[][];
};
