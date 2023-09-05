import { createComponent } from '../../../../../dist/index.js';

createComponent('smol-header', ({ $ }) => {
    const darkMode = $.store('dark-mode', {});

    return ({ render, _if }) => render`
    <header>
        <smol-logo></smol-logo>
        <p>a library for quickly creating ${ _if(darkMode, () => render`cool`) } web components</p>
        <p>zero dependencies - just javascript</p>

        <img src="./assets/img/lines.svg" />
    </header>
    `;
}, `
    header {
        padding: calc(var(--spacing) * 3);
        border-bottom: 1px solid var(--background-alt);
        position: sticky;
        top: 0;
        backdrop-filter: blur(.3rem) grayscale(1);
        z-index: 1;
        overflow: hidden;
        border-radius: var(--spacing) var(--spacing) 0 0;
    }

    header::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-color: var(--background);
        opacity: 0.75;
    }

    smol-logo {
        height: 4.25rem;
        display: block;
        margin-bottom: calc(var(--spacing) * 1.5);
    }

    p {
        margin: 0;
        padding: 0;
        text-align: center;
        font-size: var(--small);
    }

    img {
        position: absolute;
        height: 70%;
        left: 0;
        top: 0;
        right: 0;
        width: 100%;
        z-index: -1;
        object-position: top center;
        object-fit: cover;
        transform: translateY(-0.5rem);
    }
    
    @media only screen and (max-width: 500px) {
        header {
            padding: calc(var(--spacing) * 2);
        }

        smol-logo {
            height: 3rem;
            margin-bottom: calc(var(--spacing) * 1);
        }

        img {
            height: 100%;
            object-fit: contain;
            transform-origin: 50% 1rem;
            transform: scaleX(2) scaleY(2);
        }
    }
`);