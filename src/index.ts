import { createComponent } from "./lib/core.lib.js";
import { version } from "../package.json";

if (typeof window !== 'undefined') {
    (window as any).smol = {
        createComponent,
        version
    }
};

export {
    createComponent
}