import { createComponent } from '../../../../dist/index.js'

createComponent('my-span', ({ $ }) => {
    const isClicked = $.use(true);
    const isClickedAnother = $.use(() => !isClicked.get(), [isClicked]);

    const isOn = $.arg('on', (value) => {
        return !value;
    });

    $.on.create = () => {
        $.element.querySelector('button').addEventListener('click', () => {
            isClicked.set((value) => !value);
            isOn.set((value) => !value);
        });
    };


    return ({ render, _class, _if }) => render`
    <div>
        ${ _if(isOn, () => render`<span>Hello</span>`) }
        <button class="${ _class({ "on": isClicked, "off": isClickedAnother }) }">My Button</button>
    </div>
    `;
}, `
    .on {
        color: black;
        background-color: yellow;
    }

    .off {
        color: yellow;
        background-color: black;
    }
`);

createComponent('my-toggle', ({ $ }) => {
    const isClicked = $.use(true);
    const isClickedAnother = $.use(() => !isClicked.get(), [isClicked]);

    $.on.create = () => {
        $.element.querySelector('button').addEventListener('click', () => isClicked.set((value) => !value));
    };

    return ({ render, _if, _class, _bind }) => render`
    <div class="${ _class({ "on": isClicked, "off": isClickedAnother }) }">
        ${ _if(isClicked, () => render`Clicked!`) }
        <button class="hia">My Button</button>
        <span test="${ _class({ "my-cool_class": isClickedAnother }) }">Another</span>

        <my-span on="${ _bind(isClicked, isClicked) }"></my-span>
    </div>
    `;
}, `
    .on {
        color: green;
    }

    .off {
        color: red;
    }
`);