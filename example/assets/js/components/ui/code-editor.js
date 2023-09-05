import { createComponent } from '../../../../../dist/index.js';

createComponent('a-code-editor', ({ $ }) => {
    const value = $.arg('value', {});
    const label = $.arg('label', {});

    $.on.create = () => {
        const textarea = $.element.querySelector('textarea');
        textarea.addEventListener('input', (e) => {
            value.set(e.target.value);
        });
        textarea.value = value.get();
    }
    
    return ({ render, _if }) => render`
    <div class="editor">
        ${ _if(label, () => render`<span>> ${label}</span>`) }
        <textarea></textarea>
    </div>
    `;
}, `
    span {
        display: block;
        padding: var(--spacing);
        background: var(--background-alt);
        font-family: monospace;
        font-size: var(--small);
        color: var(--primary);
        border-bottom: var(--thickness) solid var(--primary-alt);
    }

    .editor {
        box-sizing: border-box;
        background: var(--background);
        color: var(--background-contrast);
        border: var(--thickness) solid var(--primary-alt);
        border-radius: var(--rounded);
        margin: var(--spacing);
        height: 100%;
        overflow: hidden;
        box-size: border-box;
    }
    
    textarea {
        padding: var(--spacing);
        background: none;
        width: 100%;
        height: 100%;
        border: none;
        margin: 0;
        resize: none;
        box-sizing: border-box;
        outline: none;
        min-height: 8rem;
    }
`);