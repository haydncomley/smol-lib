import { createComponent } from '../../../../../dist/index.js';

createComponent('a-link', ({ $ }) => {
    const href = $.arg('href', { transformer: (val) => String(val), initial: '' });
    const target = $.arg('inNewTab', { transformer: (val) => Boolean(val) ? '_blank' : false, initial: false });
    
    return ({ render, _echo }) => render`
    <a class="link" href="${ _echo(href)}" target="${ _echo(target)}">
        <slot></slot>
    </a>
    `;
}, `
    .link {
        color: var(--primary);
    }
    
    .link:hover {
        color: var(--secondary);
    }
`);