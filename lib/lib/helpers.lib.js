export const isVar = (value) => {
    return (typeof value === 'object' ? (value?.hasOwnProperty('get') && value?.hasOwnProperty('set')) : false);
};
export const isBlock = (value) => {
    return (typeof value === 'object' ? (value?.hasOwnProperty('items')) : false);
};
export const getVar = (val, ...args) => {
    return (typeof val === 'function' ? getVar(val(...args)) : val);
};
export const getVarOrPrimitive = (value) => {
    if (isVar(value)) {
        return getVar(value.get());
    }
    ;
    if (isBlock(value))
        return value.items[0]?.tagName;
    return value ?? '';
};
export const getAttributeBindings = (attr) => {
    const regex = /.+ (.+)="/gm;
    let m;
    const classes = [];
    while ((m = regex.exec(attr)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => {
            if (groupIndex === 1)
                classes.push(match);
        });
    }
    return classes[classes.length - 1];
};
