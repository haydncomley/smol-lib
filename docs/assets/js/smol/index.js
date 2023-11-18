// src/r/state.ts
function isSmolValue(object) {
  if (typeof object !== "object" || !object)
    return false;
  if ("get" in object) {
    return true;
  }
  return false;
}
function setupState(component2, changeCallback) {
  const state = {
    root: component2,
    seed: 0,
    values: [],
    bindings: {},
    onChange: changeCallback
  };
  window["smol-last-state"] = state;
  if (!window["smol-global-state"])
    window["smol-global-state"] = {};
  if (!window["smol-global-comsumers"])
    window["smol-global-comsumers"] = { seed: 0 };
  return state;
}
function value(initialValue) {
  const state = window["smol-last-state"];
  const index = state.seed++;
  const exists = state.values[index];
  let internalValue = !exists ? initialValue : exists.get();
  const internal = {
    index,
    deps: [],
    get: () => internalValue,
    set: (val) => {
      internalValue = val;
      state.onChange(internal);
      state.values.filter((v) => v.deps.find((x) => x.index === index)).forEach((b) => state.onChange(b));
    }
  };
  if (!exists)
    state.values.push(internal);
  else
    state.values[index] = internal;
  return internal;
}
function compute(transform, dependencies = []) {
  const state = window["smol-last-state"];
  const index = state.seed++;
  const exists = state.values[index];
  const internal = {
    index,
    runs: exists?.runs ?? 0,
    deps: dependencies,
    get: () => {
      state.values[index].runs = (state.values[index].runs ?? 0) + 1;
      return transform();
    }
  };
  if (!exists)
    state.values.push(internal);
  else
    state.values[index] = internal;
  return internal;
}
function sharedValue(key, initialValue) {
  const globalState = window["smol-global-state"];
  const globalExists = globalState[key];
  let internalValue = !globalExists ? initialValue : globalExists.get();
  const localValue = value(internalValue);
  if (!globalExists) {
    globalState[key] = {
      index: 0,
      deps: [],
      get: () => internalValue,
      set: (val) => {
        internalValue = val;
        console.log("setting global value", key, val);
        globalState[key].deps.forEach((dep) => dep.set(val));
      }
    };
  }
  ;
  globalState[key].deps.push(localValue);
  return globalState[key];
}

// src/r/rendering.ts
function render(template, ...args) {
  const renderTemplate = () => {
    let string = "";
    template.forEach((block, index) => {
      const nextVar = args[index];
      string += block;
      if (nextVar === void 0)
        return;
      string += isSmolValue(nextVar) ? nextVar.get() : String(nextVar);
    });
    return string;
  };
  return renderTemplate;
}
function element() {
  const state = window["smol-last-state"];
  return state?.root;
}

// src/r/component.ts
var Component = class extends HTMLElement {
  renderFunc;
  isDirty = [];
  root = this;
  constructor(func) {
    super();
    const state = setupState(this, (val) => {
      window["smol-last-state"] = state;
      window["smol-global-comsumers"].seed = 0;
      state.seed = 0;
      if (this.isDirty.length === 0) {
        requestAnimationFrame(() => {
          this.doRender();
          this.isDirty = [];
          state.values.filter((val2) => typeof val2.runs !== "undefined").filter((val2) => val2.deps.length === 0).forEach((val2) => val2.get());
        });
      }
      this.isDirty.push(val);
    });
    this.renderFunc = func();
    this.doRender();
    state.values.forEach((val) => {
      if (val.runs === 0)
        val.get();
    });
  }
  doRender() {
    const s = this.renderFunc();
    const div = document.createElement("div");
    div.innerHTML = s;
    const persistElementsOld = Array.from(this.querySelectorAll("[data-persist]"));
    const persistElementsNew = Array.from(div.querySelectorAll("[data-persist]"));
    const refocusElement = document.activeElement;
    persistElementsNew.forEach((newElement) => {
      const oldElement = persistElementsOld.find((oldElement2) => oldElement2.getAttribute("data-persist") === newElement.getAttribute("data-persist"));
      if (oldElement) {
        newElement.replaceWith(oldElement);
      }
    });
    this.root.replaceChildren(...div.children);
    if (refocusElement)
      refocusElement?.focus();
  }
};
function component(tag, func) {
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
function listen(selector, event, callback) {
  const rootElement = element();
  compute(() => {
    const element2 = rootElement.querySelector(selector);
    if (element2)
      element2.addEventListener(event, callback);
    else
      console.warn(`Could not find element with selector '${selector}'`);
  });
}
function bind(selector, key, val) {
  const rootElement = element();
  compute(() => {
    const element2 = rootElement.querySelector(selector);
    if (element2)
      element2[key] = val.get();
    else
      console.warn(`Could not find element with selector '${selector}'`);
  }, [val]);
}
function input(selector, val, callback) {
  bind(selector, "value", val);
  listen(selector, "input", (e) => {
    val.set(e.target.value);
    if (callback)
      callback();
  });
}
function provide(key, val) {
  const rootElement = element();
  if (!rootElement["smol-provide-state"])
    rootElement["smol-provide-state"] = {};
  rootElement["smol-provide-state"][key] = val;
}
function consume(key) {
  const localKey = `consumer-key-${key}-${window["smol-global-comsumers"].seed++}`;
  const checkParent = (element2) => {
    if (element2["smol-provide-state"]) {
      return element2["smol-provide-state"][key];
    } else if (element2.parentElement) {
      return checkParent(element2.parentElement);
    }
  };
  const root = element();
  const val = checkParent(root);
  window["smol-global-comsumers"][localKey] = val?.get() || window["smol-global-comsumers"][localKey];
  const localVal = value(window["smol-global-comsumers"][localKey]);
  setTimeout(() => {
    const val2 = checkParent(root);
    window["smol-global-comsumers"][localKey] = val2.get();
    localVal.set(window["smol-global-comsumers"][localKey]);
  });
  return localVal;
}
export {
  bind,
  component,
  compute,
  consume,
  element,
  input,
  listen,
  provide,
  render,
  sharedValue,
  value
};
//# sourceMappingURL=index.js.map
