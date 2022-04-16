---
layout: page.11ty.cjs
title: <toc-observer> ⌲ Home
---

# &lt;toc-observer>

`<toc-observer>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<toc-observer>` is just an HTML element. You can it anywhere you can use HTML!

```html
<toc-observer></toc-observer>
```

  </div>
  <div>

<toc-observer></toc-observer>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<toc-observer>` can be configured with attributed in plain HTML.

```html
<toc-observer name="HTML"></toc-observer>
```

  </div>
  <div>

<toc-observer name="HTML"></toc-observer>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<toc-observer>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;toc-observer&gt;</h2>
    <toc-observer .name=${name}></toc-observer>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;toc-observer&gt;</h2>
<toc-observer name="lit-html"></toc-observer>

  </div>
</section>
