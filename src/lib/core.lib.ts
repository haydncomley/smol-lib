import { isVar, isBlock, getVarOrPrimitive, getVar, getAttributeBindings } from "./helpers.lib.js";
import { ComponentBlock, ComponentOptions, ComponentRenderOptions, ComponentSettings, ComponentVariable } from "./types.lib.js";

const createCommentMarker = (id: string | number, item: any, context: string) => {
    if (context.endsWith('="')) return `<!--A::-->`;

    const type = isVar(item) ? 'V' : isBlock(item) ? 'B' : 'P';
    const value = getVarOrPrimitive(item);
    const tempName =  `${type}::${type === 'V' ? item.id : id}`;
    return type === 'P' ? value : `<!--${tempName}-->`;
}

const getAllCommentMarkers = (root: HTMLElement | ChildNode) => {
    const treeWalker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_COMMENT,
        {
            "acceptNode": function acceptNode (node) {
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let currentNode = treeWalker.nextNode();
    const nodeList = [];
    while (currentNode) {
        nodeList.push(currentNode);
        currentNode = treeWalker.nextNode();
    }

    return nodeList;
}

export const createHTML = (store: unknown[], bindings: ((newValue: any) => void)[][], component: TemplateStringsArray, ...args: unknown[]) => {
    const argsLength = component.raw.length - 1;
    const attributeBindingsKeys: string[] = [];
    const attributeBindings: ComponentBlock[] = [];

    const transformed = component.raw.reduce((prev, curr, i) => {
        if (curr.endsWith('="')) {
            attributeBindings.push(args[i] as ComponentBlock);
            attributeBindingsKeys.push(getAttributeBindings(curr));
        }

        return prev + curr + ((i < argsLength) ? createCommentMarker(i, args[i], curr) : '');
    }, '');

    const wrapped = document.createElement('div');
    wrapped.innerHTML = transformed.trim();

    let totalItems: (Node | null)[] = [];
    let itemID = 0;

    const checkForBindings = (items: (Node | null)[]) => {
        totalItems = [...totalItems, ...items];
        const totalParentId = itemID;
        const regex = /([V|B])::(.*)/g;
        for (let i = itemID; i < items.length; i++) {
            const item = totalItems[i];
            itemID++;
            const val = item?.textContent?.trim() ?? '';
            if(val.match(regex)) {
                const split = item?.textContent?.trim().split('::') ?? [];
                if (split[0] === 'V') {
                    const getVal = () => {
                        const val = store[parseInt(split[1])];
                        return typeof val === 'function' ? val() : val
                    };

                    const text = document.createTextNode(getVal());
                    (totalItems[i] as HTMLElement)?.replaceWith(text);
                    totalItems[i] = text;

                    bindings[parseInt(split[1])].push(() => {
                        totalItems[i]!.textContent = getVal();
                    });
                } else if (split[0] === 'B') {
                    const block = args.filter((i) => typeof i !== 'number' && !['class', 'bind'].includes((i as any).evalType))[i - 1] as ComponentBlock;
                    if (block?.evalType === 'if') {
                        const doEval = () => {
                            const val = getVar(block.eval?.get());
                            if (val) {
                                const element = block.evalRender!(true, 1).items[totalParentId]!;
                                (totalItems[i] as HTMLElement)?.replaceWith(element);
                                totalItems[i] = element;
                            } else {
                                const text = document.createComment(`B::${split[1]}`);
                                (totalItems[i] as HTMLElement)?.replaceWith(text);
                                totalItems[i] = text;
                            }
                        }

                        bindings[block.eval!.id].push(() => doEval());
                        doEval();
                    }

                    if (block?.evalType === 'for') {
                        const doEval = () => {
                            const baseItem = totalItems[i] as any;
                            if (!baseItem.arrayItems) baseItem.arrayItems = [];
                            const itemsArray = baseItem.arrayItems;

                            const val = getVar(block.eval?.get());
                            const newItems = typeof val === 'number' ? Array.from({ length: val }, (_, i) => i) : val as unknown[];

                            if (!(totalItems[i] as any).arrayItems) (totalItems[i] as any).arrayItems = [];

                            if (itemsArray.length > newItems.length) {
                                for (let i = itemsArray.length; i > newItems.length; i--) {
                                    itemsArray.pop().remove();
                                }
                            } else if (itemsArray.length < newItems.length) {
                                for (let i = itemsArray.length; i < newItems.length; i++) {
                                    const element = block.evalRender!(newItems[i], i).items[totalParentId]!;
                                    (itemsArray[itemsArray.length - 1] || baseItem).after(element);
                                    itemsArray.push(element);
                                }
                            }
                        }
                    bindings[block.eval!.id].push(() => doEval());
                        doEval();
                    }
                }
            }
        }
    }

    checkForBindings([
        wrapped.firstChild,
        ...getAllCommentMarkers(wrapped.firstChild!)
    ]);

    let attrBindCount = 0;
    attributeBindingsKeys.forEach(attr => {
        const elements = (totalItems[0] as HTMLElement).parentElement!.querySelectorAll(`*[${attr}="<!--A::-->"]`);
        elements.forEach((element) => {
            Array.from(element.attributes).forEach((attr) => {
                if(attr.value === '<!--A::-->') {
                    const index = attrBindCount++;
                    const currentBinding = attributeBindings[index];

                    if (currentBinding.evalType === 'class') {
                        const doEval = () => {
                            element.setAttribute(attr.name, currentBinding.eval?.get());
                        }
    
                        doEval();
                        currentBinding.items.forEach((item) => {
                            bindings[(item as unknown as ComponentVariable<boolean>).id].push(() => doEval());
                        })
                    } else if (currentBinding.evalType === 'bind') {
                        const name = attr.name;
                        element.removeAttribute(attr.name);

                        const doEval = () => {
                            const targetElement = element as any;
                            if (targetElement.setBinding) {
                                targetElement.setBinding(name, currentBinding.eval?.get());
                            }
                        }
    
                        doEval();
                        bindings[currentBinding.eval!.id].push(() => doEval());
                        if (currentBinding.items[0] !== undefined) {
                            (element as any).getBinding(name, (val: unknown) => {
                                store[currentBinding.eval!.id] = val;
                                bindings[currentBinding.eval!.id].forEach((r) => r(val));
                            });
                        }
                    }
                }
            })
        })
    });

    return {
        items: totalItems
    } as ComponentBlock;
}

export const createComponent = (tag: string, func: (options: {
    $: ComponentOptions
}) => ((renderOptions: ComponentRenderOptions) => ComponentBlock), settings?: ComponentSettings | string) => {
    if (customElements.get(tag)) {
        console.error(`Component with tag "${tag}" has already been defined.`);
        return;
    }

    customElements.define(tag, class extends HTMLElement {
        componentArgStore: { [key: string]: ComponentVariable<any>; };
        componentStoreBindings: (() => void)[][];
        constructor() {
            super();
            ;
            const root = this.attachShadow({ mode: 'closed' });
            
            if (typeof settings === 'string' || settings?.styles !== undefined) {
                const styles = document.createElement('style');
                styles.innerText = typeof settings === 'string' ? settings : settings.styles!;
                root.appendChild(styles);
            }
            const { componentArgStore, componentStoreBindings } = createComponentLogic(root, func);
            this.componentArgStore = componentArgStore;
            this.componentStoreBindings = componentStoreBindings;
        }

        setBinding = (key: string, val: unknown) => {
            if (this.componentArgStore[key]) this.componentArgStore[key].set(() => val);
        };

        getBinding = (key: string, callback: (value: any) => void) => {
            if (this.componentArgStore[key]) {
                this.componentStoreBindings[this.componentArgStore[key].id].push(() => {
                    callback(this.componentArgStore[key].get());
                });
            }
        };
    });
};

export const createComponentLogic = (root: ShadowRoot, func: (options: {
    $: ComponentOptions
}) => ((renderOptions: ComponentRenderOptions) => ComponentBlock)) => {
    let componentStore: unknown[] = [];
    let componentStoreBindings: (() => void)[][] = [];
    let componentArgStore: { [key: string]: ComponentVariable<any> } = {};
    let componentRenderer: (renderOptions: ComponentRenderOptions) => ComponentBlock;
    let componentStoreCycleIndex = 0;
    let componentRenderCycleIndex = 0;

    const componentOptions: Partial<ComponentOptions> = {};

    const localisedUpdateTrigger = () => {
        componentRenderCycleIndex++;
        const funcReturn = componentRenderer({
            render: (component: TemplateStringsArray, ...args: unknown[]) => createHTML(componentStore, componentStoreBindings, component, ...args),
            _if: (condition, render) => {
                return {
                    items: [],
                    eval: condition,
                    evalRender: render,
                    evalType: 'if'
                }
            },
            _for: (condition, render) => {
                return {
                    items: [],
                    eval: condition,
                    evalRender: render as any,
                    evalType: 'for'
                }
            },
            _class: (classes) => {
                const classListeners = componentOptions.use!(() => {
                    return Object.values(classes).map((x) => x.get()).map((x, i) => x ? Object.keys(classes)[i] : '').join(' ').trim();
                }, []);

                return {
                    items: Array.from(Object.values(classes)) as any,
                    eval: classListeners,
                    evalType: 'class'
                }
            },
            _bind: (value, backBind) => {
                return {
                    items: [backBind as any, (value: (prevValue: unknown) => unknown) => {
                        const newValue =  value(componentStore[backBind!.id] as unknown);
                        componentStore[backBind!.id] = newValue;
                        componentStoreBindings[backBind!.id].forEach((binding) => binding());
                    }],
                    eval: value,
                    evalType: 'bind'
                }
            }
        });

        componentOptions.element!.appendChild(funcReturn.items[0]!);
        if (componentOptions.on?.create) componentOptions.on.create();
    }
    
    componentOptions.on = {} as any;
    componentOptions.use = (val, deps = []) => {
        const index = ++componentStoreCycleIndex;
        if (index > componentStore.length) {
            componentStore.push(getVarOrPrimitive(val));
            componentStoreBindings.push([]);
        };

        deps.forEach((dep) => {
            componentStoreBindings[dep.id].push(() => {
                componentStoreBindings[index - 1].forEach((binding) => binding());
            });
        });

        return {
            id: index - 1,
            get: () => getVar(componentStore[index - 1]),
            set: (value: (prevValue: typeof val) => typeof val) => {
                const newValue =  value(componentStore[index - 1] as typeof val);
                if (newValue !== componentStore[index - 1]) {
                    componentStore[index - 1] = newValue;
                    componentStoreBindings[index - 1].forEach((binding) => binding());
                }
            },
        } as ComponentVariable<typeof val>
    };
    componentOptions.arg = (key, transformer, initial) => {
        if (!componentArgStore[key]) componentArgStore[key] = componentOptions.use!(initial);
        const keyedVariable = componentArgStore[key];
        return {
            id: keyedVariable.id,
            get: () => transformer ? transformer(getVar(componentStore[keyedVariable.id])) : getVar(componentStore[keyedVariable.id]),
            set: (callback) => {
                keyedVariable.set(callback);
            }
        }  as ComponentVariable<any>
    };

    componentOptions.rootElement = root.host as HTMLElement;
    componentOptions.element = root;

    componentRenderer = func({ $: componentOptions as ComponentOptions });
    localisedUpdateTrigger();
    return { componentArgStore, componentStore, componentStoreBindings }
}