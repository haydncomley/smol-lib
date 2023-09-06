import { ComponentVariable } from "./types.lib.js";
export declare const isVar: (value: unknown) => boolean;
export declare const isBlock: (value: unknown) => boolean;
export declare const getVar: <T>(val: ReturnType<ComponentVariable<unknown>['get']>, ...args: any[]) => T;
export declare const getVarOrPrimitive: (value: unknown) => unknown;
export declare const getAttributeBindings: (attr: string) => string;
