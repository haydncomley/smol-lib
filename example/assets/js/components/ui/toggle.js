import { createComponent } from '../../../../../dist/index.js';

createComponent('a-toggle', ({ $ }) => {
    const value = $.arg('value', { transformer: (val) => Boolean(val), initial: false });
    const disabled = $.arg('disabled', { transformer: (val) => Boolean(val), initial: false });

    $.on.create = () => {
        $.element.querySelector('button').addEventListener('click', () => {
            value.set((val) => !val);
        });
    }
    
    return ({ render, _class, _echo }) => render`
    <button class="${ _class({ toggle: true, on: value, disabled: disabled }) }" disabled="${ _echo(disabled)}">
        <span></span>
    </button>
    `;
}, `
    .toggle {
        box-sizing: content-box;
        background: var(--background);
        border: var(--thickness) solid var(--background-alt);
        border-radius: var(--round);
        padding: var(--break);
        position: relative;
        margin: 0;
        width: calc(var(--normal) * 2);
        transition: var(--animate);
        -webkit-tap-highlight-color: transparent;
    }

    .toggle.disabled {
        pointer-events: none;
        opacity: var(--faded);
        filter: grayscale(50%);
    }

    .toggle.on {
        background: var(--primary-alt);
        border-color: var(--primary);
        box-shadow: var(--spread) var(--primary-glow) inset;
    }

    .toggle:hover {
        cursor: pointer;
    }

    
    .toggle span {
        box-sizing: content-box;
        width: var(--normal);
        height: var(--normal);
        background: var(--background-alt);
        border-radius: inherit;
        display: block;
        transition: var(--animate);
    }
    
    .toggle.on span {
        transform: translateX(100%) scale(1.15);
        background: var(--primary);
    }
    
    .toggle:hover span {
        opacity: 0.75;
    }
`);