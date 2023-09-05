import { createComponent } from '../../../dist/index.js'
import { PrefersDarkMode, SetPrefersDarkMode } from './logic/dark-mode.js'

createComponent('a-app', ({ $ }) => {    
    const enableDarkMode = $.store('dark-mode', {
        initial: PrefersDarkMode(),
    });

    const myLinks = $.use([
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
    ]);

    
    const onClick = $.action(() => enableDarkMode.set(true));
    const buttonText = $.use(() => {
        SetPrefersDarkMode(enableDarkMode.get());
        return enableDarkMode.get() ? 'Disabled' : 'Enabled';
    }, [enableDarkMode]);

    return ({ render, _bind, _echo, _class, _for }) => render`
    <main class="${ _class({ dark: enableDarkMode }) }">
        <a-page>
            <smol-header></smol-header>

            <a-list-item label="Dark Mode">
                <a-toggle value="${ _bind(enableDarkMode) }"></a-toggle>
            </a-list-item>
            <a-list-item label="Toggle Switch">
                <a-toggle></a-toggle>
            </a-list-item>
            <a-list-item label="Radio Checkbox">
                <a-radio></a-radio>
            </a-list-item>
            <a-list-item label="This is a button">
                <a-button disabled="${ _bind(enableDarkMode) }" click="${ _bind(onClick) }">
                    Button ${buttonText}
                </a-button>
            </a-list-item>
            <a-list-item label="This is another button">
                <a-button>
                    Useless Button
                </a-button>
            </a-list-item>
            <a-list-item label="This is a link">
                <a-link href="#test">
                    Useless Button
                </a-link>
            </a-list-item>
            <a-list-item label="This is a different link">
                <a-link href="#test" inNewTab>
                    Open New Tab
                </a-link>
            </a-list-item>

            ${ _for(myLinks, (val) => render`
            <a-list-item label="${_echo(val.label)}">
                <a-link href="${_echo(val.href)}" inNewTab>
                    ${val.href}
                </a-link>
            </a-list-item>
            `) }


            <span alt="${ _echo(buttonText) }"></span>
        </a-page>
    </main>
    `;
}, `
    main {
        width: 100%;
        height: 100%;
        background: var(--background);
        color: var(--background-contrast);
        color-scheme: light;
        overflow: auto;
    }

    main.dark {
        --background: #101010;
        --background-alt: #3a3a3a;
        --background-contrast: #ffffff;
    
        --primary-alt: #52575e;
        --primary-glow: #5d6982;
        --is-dark-mode: true;
        color-scheme: dark;
    }

    @media only screen and (min-width: 800px) {
        main {
            padding: 0 var(--spacing);
            box-sizing: border-box;
        }
    }
`);