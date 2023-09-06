<p align="center">
    <p align="center">
        <img src="https://github.com/haydncomley/smol-lib/blob/main/example/assets/img/favicon.png?raw=true" height="75px">
        <br/>
        a library for quickly creating web components
        <br/>
        zero dependencies - just javascript
    </p>
</p>

<p align="center">
    <a href="https://smol-library.web.app/">View Smol Example Website</a>
</p>

<p align="center">
	<a href="https://www.npmjs.com/package/smol-lib"><img src="https://img.shields.io/bundlephobia/min/smol-lib?style=flat-square" alt="NPM downloads"></a>
</p>

---

<p align="center">
	<h3 align="center">Another damn library? Why?</h3>
	<p align="center">
		Simply just... <i>because</i>. I like to create fun and helpful things - plus there seemed like a slight gap for a web-based, no-build, no-dependencies, no-nothing, prototyping library (at least for me); So here we are.
	</p>
</p>

---

<p align="center">
	<h3 align="center">Is it performant?</h3>
	<p align="center">
		Probably not... Performance wasn't something I was overly aiming for - it's usable, and works well for smaller prototypes and apps but I wouldn't go off making a full-scale app with it... But then maybe?
	</p>
</p>

---

<p align="center">
	<h3 align="center">How do I use it?</h3>
	<p align="center">
		Either <code>yarn add smol-lib</code> or copy <code>lib/index.js</code> into your project and off you go.
    </p>
</p>

```javascript
import { createComponent } from '.../index.js';

createComponent('my-component', () => {
    return ({ render }) => render`
    <p class="my-component">
        Hello from my component!
    </p>
    `;
}, `
    .my-component {
        display: block;
        margin: 0;
        padding: 0;
    }
`);
```

---

<p align="center">
	<h3 align="center">Are there docs?</h3>
	<p align="center">
		No docs as of yet, which obviously is not helpful.
        <br/>
        However I am working on an example site/app that will have the docs on it... it's in development (no ETA) but you can check it out at
        <br/>
        <a href="https://smol-library.web.app/">smol-library.web.app</a>
        <br/>
        (source code in <a href="/example">/example</a>)
	</p>
</p>

---