import { createComponent } from '../../../../../lib/index.js';

createComponent('a-list-item', ({ $ }) => {
    const label = $.arg('label', { transformer: (val) => String(val) });

    return ({ render, _if }) => render`
    <div class="list-item">
        ${ _if(label, () => render`<label>${ label }</label>`)  }
        <slot></slot>
    </div>
    `;
}, `
    .list-item {
        border-bottom: 1px solid var(--background-alt);
        border-radius: var(--roundness);
        padding: var(--spacing);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .list-item label {
        display: block;
        font-size: var(--normal);
    }
`);