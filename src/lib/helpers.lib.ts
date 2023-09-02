import { ComponentVariable } from "./types.lib.js";

export const isVar = (value: unknown) => {
    return (typeof value === 'object' ? (value?.hasOwnProperty('get') && value?.hasOwnProperty('set')) : false) as boolean;
}

export const isBlock = (value: unknown) => {
    return (typeof value === 'object' ? (value?.hasOwnProperty('items')) : false) as boolean;
}

export const getVar = <T>(val: ReturnType<ComponentVariable<unknown>['get']>): T => {
    return (typeof val === 'function' ? getVar(val()) : val) as T;
}

export const getVarOrPrimitive = (value: unknown) => {
    if (isVar(value)) {
        return getVar((value as { get: () => unknown }).get());
    };
    if (isBlock(value)) return (value as { items: HTMLElement[] }).items[0]?.tagName;
    return value ?? '';
}

export const getAttributeBindings = (attr: string) => {
    const regex = /.+ (.+)="/gm;
    let m;
    const classes: string[] = [];
    
    while ((m = regex.exec(attr)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        m.forEach((match, groupIndex) => {
            if (groupIndex === 1) classes.push(match);
        });
    }

    return classes[classes.length - 1];
}