import { createComponent } from '../../../../../dist/index.js';

createComponent('a-button', ({ $ }) => {
    const click = $.arg('click', { initial: () => {} });
    const disabled = $.arg('disabled', { transformer: (val) => Boolean(val), initial: false });

    $.on.create = () => {
        $.element.querySelector('button').addEventListener('click', click.get);
    }
    
    return ({ render, _class, _echo }) => render`
    <button class="${ _class({ button: true, disabled: disabled }) }" disabled="${ _echo(disabled)}">
        <slot></slot>
    </button>
    `;
}, `
    .button {
        box-sizing: border-box;
        background: var(--primary);
        color: var(--primary-contrast);
        border: var(--thickness) solid var(--primary-alt);
        border-radius: var(--rounded);
        padding: var(--spacing) calc(var(--spacing) * 2);
        position: relative;
        margin: 0;
        transition: var(--animate);
        font-size: var(--normal);
    }

    .button.disabled {
        pointer-events: none;
        opacity: var(--faded);
        filter: grayscale(100%);
    }

    .button:hover {
        cursor: pointer;
        transform: scale(1.025);
        border-radius: calc(var(--rounded) * 1.5);
        box-shadow: var(--spread) var(--primary-glow);
    }

    .button:active {
        cursor: pointer;
        transform: scale(.95);
        box-shadow: none;
    }
`);