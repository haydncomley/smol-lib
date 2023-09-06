import { createComponent } from '../../../../../lib/index.js';

createComponent('a-code-preview', ({ $ }) => {
    const value = $.arg('value', {
        transformer: (e) => {
            console.log(e);
            return e;
        }
    });
    const label = $.arg('label', {});
    
    return ({ render, _bind }) => render`
    <div class="code-preview">
        <a-code-editor label="${ _bind(label) }" value="${ _bind(value) }"></a-code-editor>
        <div class="preview">
            <my-component></my-component>
        </div>
    </div>
    `;
}, `
    .code-preview {
        box-sizing: border-box;
        background: var(--background);
        color: var(--background-contrast);
        border: var(--thickness) solid var(--primary-alt);
        border-radius: var(--rounded);
        margin: var(--spacing);
        height: 100%;
        overflow: hidden;
        box-size: border-box;
        min-height: 8rem;
    }

    .preview {
        box-sizing: border-box;
        background: var(--background);
        color: var(--background-contrast);
        border: var(--thickness) solid var(--primary-alt);
        border-radius: var(--rounded);
        margin: var(--spacing);
        height: 100%;
        overflow: hidden;
        box-size: border-box;
        min-height: 8rem;
        padding: var(--spacing);
    }
`);