import { createComponent } from '../../../../../lib/index.js';

createComponent('a-text', () => {
    return ({ render }) => render`
    <p class="text">
        <slot></slot>
    </p>
    `;
}, `
    .text {
        display: block;
        margin: 0;
        padding: 0;
    }
`);