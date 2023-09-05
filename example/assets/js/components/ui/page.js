import { createComponent } from '../../../../../dist/index.js';

createComponent('a-page', () => {
    return ({ render }) => render`
    <div class="page">
        <slot></slot>
    </div>
    `;
}, `
    .page {
        display: block;
        max-width: 800px;
        margin: auto;
    }

    .page::after {
        content: '';
    }

    @media only screen and (min-width: 800px) {
        .page {
            border-left: var(--thickness) solid var(--background-alt);
            border-right: var(--thickness) solid var(--background-alt);
            margin: auto;
            overflow: auto;
            height: 100%;
            box-sizing: border-box;
        }
    }
`);