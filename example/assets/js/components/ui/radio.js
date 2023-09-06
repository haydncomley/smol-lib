import { createComponent } from '../../../../../lib/index.js';

createComponent('a-radio', ({ $ }) => {
    const value = $.arg('value', { transformer: (val) => Boolean(val), initial: false });
    const disabled = $.arg('disabled', { transformer: (val) => Boolean(val), initial: false });

    $.on.create = () => {
        $.element.querySelector('button').addEventListener('click', () => {
            value.set((val) => !val);
        });
    }
    
    return ({ render, _class, _echo }) => render`
    <button class="${ _class({ checkbox: true, on: value, disabled: disabled }) }" disabled="${ _echo(disabled)}">
        <span></span>
    </button>
    `;
}, `
    .checkbox {
        box-sizing: content-box;
        background: var(--background);
        border: var(--thickness) solid var(--background-alt);
        border-radius: var(--round);
        padding: var(--break);
        position: relative;
        margin: 0;
        width: calc(var(--normal));
        transition: var(--animate);
        -webkit-tap-highlight-color: transparent;
    }

    .checkbox.disabled {
        pointer-events: none;
        opacity: var(--faded);
        filter: grayscale(50%);
    }

    .checkbox.on {
        background: var(--primary-alt);
        border-color: var(--primary);
        box-shadow: var(--spread) var(--primary-glow) inset;
    }

    .checkbox:hover {
        cursor: pointer;
    }

    
    .checkbox span {
        box-sizing: content-box;
        width: var(--normal);
        height: var(--normal);
        background: var(--background-alt);
        border-radius: inherit;
        display: block;
        transition: var(--animate);
        opacity: 0;
    }
    
    .checkbox.on span {
        transform: scale(1);
        background: var(--primary);
        opacity: 1;
    }

    .checkbox:not(.on):hover span {
        transform: scale(0.8);
        opacity: 0.5;
    }
    
    .checkbox:hover span {
        opacity: 0.75;
    }

    .checkbox:active span {
        transform: scale(0.8);
        opacity: 1;
    }
`);