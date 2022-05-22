# `<toc-observer>` highlight links in a table of contents

## About

A table of contents (**TOC**) is a 
list of chapters, section titles and similiar.
On a website, a blog, these are usually links to the 
corresponding sections. This web component takes any 
HTML and tries to highlight links inside it based on 
the visibile sections. Even if any kind of HTML would work,
you should probably use a list.

## Features
- Configurable through [attributes](#attributes)
- Framework / platform agnostic, use it wherever you like as long as it has a DOM and JS enabled
- Works with "unusual" Markup structure as seen below
- Usage of [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for performant DOM observation

## Usage
Your markup should resemble something like the following, 
note the `slot` attribute and how links only contain an ID to the corresponding element you would want to highlight.
```html
<toc-observer>
  <!-- The "toc" slot and its name is mandatory -->
  <ul slot="toc">
    <li>
      <!-- Links must begin with a hash ('#') -->
      <a href="#possums" class="toc-item">Possums</a>
      <ul>
        <li><a href="#diet" class="toc-item">Diet</a></li>
        <li><a href="#reproduction" class="toc-item">Reproduction</a></li>
      </ul>
    </li>
  </ul>
</toc-observer>
```
Styling is up to you but you can override the `tocActiveClass` attribute or just style the default which would be something like this:
```css
toc-observer a.toc-active {
  color: var(--toc-color-active);
  border-left-color: var(--toc-color-active);
}

/* Not yet supported everywhere but cool: */
toc-observer a:has(+ ul li > .toc-active) {
  border-left: 2px solid var(--toc-color-active);
}
```

### Observing parent elements
Most blogs or documentation pages are based on the following markup so that only visible headings are highlighted. However, it can also be interesting to highlight all visible sections instead of just headings - because that is what is currently visible on the screen. In a case like this, where it is not possible to apply IDs to these sections, the following configuration helps.
```html
<toc-observer observeParent>
  <!-- 
    ^set parentSelector="my-selector" 
    if it differs from 'section' 
  -->
  
  <!-- Previous markup -->
<toc-observer>

<!-- Content -->
<section>
  <h2 id="characteristics">Characteristics</h2>
  <p>Opossum are immune to rabies (...)</p>
</section>

<section>
  <h3 id="diet">Diet</h3>
</section>

<section>
  <h3 id="reproduction">Reproduction</h3>
</section>
```
The idea of using sections or parent elements as a reference of observable items stems from this [post](https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation/) by Bramus Van Damme - which I think is what you want from such a component.

## Attributes
| Name                   | Required                   | Default          | Description                                           |
|------------------------|----------------------------|------------------|-------------------------------------------------------|
| `tocActiveClass`       | No                         | `toc-active`     | CSS class which is added to / removed from a TOC link |
| `rootElement`          | No                         | `null`           | The intersection element for your content.            |
| `rootMargin`           | No                         | `0px`            | Bounding box inside `rootElement`                     |
| `observeParent`        | If `parentSelector` is set | `false`          | Useful to watch intersecting wrapper elements         |
| `parentSelector`       | No                         | `section`        | Specifiy the wrapper element that should be selected  |

## Setup

Install dependencies:

```bash
npm i
```

## Build

`<toc-observer>` uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

To build the JavaScript version of your component:

```bash
npm run build
```

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
npm run build:watch
```

Both the TypeScript compiler and lit-analyzer are configured to be very strict. You may want to change `tsconfig.json` to make them less strict.

## Dev Server

`<toc-observer>` uses modern-web.dev's [@web/dev-server](https://www.npmjs.com/package/@web/dev-server) for previewing the project without additional build steps. Web Dev Server handles resolving Node-style "bare" import specifiers, which aren't supported in browsers. It also automatically transpiles JavaScript and adds polyfills to support older browsers. See [modern-web.dev's Web Dev Server documentation](https://modern-web.dev/docs/dev-server/overview/) for more information.

To run the dev server and open the project in a new browser tab:

```bash
npm run serve
```

There is a development HTML file located at `/dev/index.html` that you can view at http://localhost:8000/dev/index.html. Note that this command will serve your code using Lit's development mode (with more verbose errors). To serve your code against Lit's production mode, use `npm run serve:prod`.

## Editing

If you use VS Code, it is highly recommend the [lit-plugin extension](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin), which enables some extremely useful features for lit-html templates:

- Syntax highlighting
- Type-checking
- Code completion
- Hover-over docs
- Jump to definition
- Linting
- Quick Fixes

The project is setup to recommend lit-plugin to VS Code users if they don't already have it installed.

## Linting

Linting of TypeScript files is provided by [ESLint](eslint.org) and [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint). In addition, [lit-analyzer](https://www.npmjs.com/package/lit-analyzer) is used to type-check and lint lit-html templates with the same engine and rules as lit-plugin.

The rules are mostly the recommended rules from each project, but some have been turned off to make LitElement usage easier. The recommended rules are pretty strict, so you may want to relax them by editing `.eslintrc.json` and `tsconfig.json`.

To lint the project run:

```bash
npm run lint
```

## Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Lit's style. You can change this in `.prettierrc.json`.

Prettier has not been configured to run when committing files, but this can be added with Husky and and `pretty-quick`. See the [prettier.io](https://prettier.io/) site for instructions.

To lint the project run:

```bash
npm run format
```

## Bundling and minification

This component doesn't include any build-time optimizations like bundling or minification. We recommend publishing components as unoptimized JavaScript modules, and performing build-time optimizations at the application level. This gives build tools the best chance to deduplicate code, remove dead code, and so on.

For information on building application projects that include LitElement components, see [Build for production](https://lit.dev/docs/tools/production/) on the Lit site.

## Useful resources
- [Get started](https://lit.dev/docs/getting-started/) on the lit.dev site for more information.
- [Open Web Component scaffold generators](https://open-wc.org/docs/development/generator/) (an alternative for this starter project)
- [Lit & Friends Slack](https://lit.dev/slack-invite/)
- [Smooth Scrolling Sticky ScrollSpy Navigation ](https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation/) by Bramus Van Damme