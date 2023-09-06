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
        <code>yarn add smol-lib</code>
        <br/>
        or <a href="https://cdn.jsdelivr.net/npm/smol-lib@latest">https://cdn.jsdelivr.net/npm/smol-lib@latest</a>
        <br/>
		or copy <a href="/lib/index.js">/lib/index.js</a> into your project.
    </p>
</p>

```javascript
// via - package import
import { createComponent } from 'smol-lib';

createComponent('my-component', () => {
    return ({ render }) => render`
    <p class="my-component">
        Hello from my component!
    </p>
    `;
}, `
	@keyframes rainbow {
    	0% {
      	color: hsl(0, 100%, 50%);
      }
      
      33% {
      	color: hsl(100, 100%, 50%);
      }
      
      77% {
      	color: hsl(300, 100%, 50%);
      }
      
      100% {
      	color: hsl(360, 100%, 50%);
      }
    }
	
    .my-component {
        animation: rainbow 1s infinite;
    }
`);
}
```

```html
// via - CDN (https://cdn.jsdelivr.net/npm/smol-lib@latest)
<script type="module" src="https://cdn.jsdelivr.net/npm/smol-lib@latest" onload="onload()"></script>

<script>
    function onload() {
        smol.createComponent('my-component', () => {
        return ({ render }) => render`
        <p class="my-component">
            Hello from my component!
        </p>
        `;
    }, `
        @keyframes rainbow {
            0% {
            color: hsl(0, 100%, 50%);
        }
        
        33% {
            color: hsl(100, 100%, 50%);
        }
        
        77% {
            color: hsl(300, 100%, 50%);
        }
        
        100% {
            color: hsl(360, 100%, 50%);
        }
        }
        
        .my-component {
            animation: rainbow 1s infinite;
        }
    `);
    }
</script>
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