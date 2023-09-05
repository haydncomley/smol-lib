import { createComponent } from '../../../../../dist/index.js';
import { PrefersDarkMode } from '../../logic/dark-mode.js'

createComponent('smol-logo', ({ $ }) => {
    const logoType = $.store('dark-mode', {
        initial: PrefersDarkMode(),
        transformer: (val) => {
            if (val) return './assets/img/smol-logo.png';
            else return './assets/img/smol-logo-dark.png';
        }
    });

    return ({ render, _echo }) => render`<img src="${ _echo(logoType) }" />`;
}, `
    img {
        display: block;
        width: 100%;
        height: 100%;
        aspect-radio: 1 / 1;
        object-fit: contain;
    }
`);