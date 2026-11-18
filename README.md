# Narleaf Reveal

Tiny scroll-triggered reveal animations. Add one attribute, get an animation when the element scrolls into view.

Narleaf (NAR-leaf) is a small family of front-end tools: **Narleaf Reveal** (this project), [Narleaf Motion](https://github.com/withmehmet/narleaf-motion) and [Narleaf Layout](https://github.com/withmehmet/narleaf-layout). They share the same `nar-` naming.

- **~2.2 KB gzipped** (minified CSS 0.99 KB + JS 1.21 KB), no dependencies, no build step
- **Content never stays hidden**: if the script fails, is blocked, or you print the page, everything is shown
- Respects `prefers-reduced-motion`
- 26 effects, replay on scroll, delay / duration / distance / easing / stagger / trigger-point options

> Looking for the JavaScript-free, CSS-only scroll-driven version? See **[Narleaf Motion](https://github.com/withmehmet/narleaf-motion)**.
> Narleaf Reveal is the JS-triggered sibling: it plays when an element enters the screen, supports replay and stagger, and works in browsers without CSS scroll-driven animations.

## Install

Copy `narleaf-reveal.css` and `narleaf-reveal.js` (or the `.min` versions) into your project:

```html
<link rel="stylesheet" href="narleaf-reveal.css" />
<script src="narleaf-reveal.js" defer></script>
```

## Use

```html
<div data-nar-reveal="slide-left">Hello</div>

<div data-nar-reveal="zoom-in-center" data-nar-reveal-delay="300" data-nar-reveal-duration="900">
  Delayed zoom
</div>
```

Effect names say where the element comes **from**: `left`, `right`, `top`, `bottom`.
An empty or unknown value (`data-nar-reveal` or `data-nar-reveal="oops"`) simply fades in.
One effect per element. To combine effects, nest elements.

## Effects

| Family | Values |
|---|---|
| Fade | `fade` |
| Slide | `slide-left` `slide-right` `slide-top` `slide-bottom` |
| Zoom | `zoom-in-center` `zoom-in-left` `zoom-in-right` `zoom-in-top` `zoom-in-bottom` |
| Bounce | `bounce-in-center` `bounce-in-left` `bounce-in-right` `bounce-in-top` `bounce-in-bottom` |
| Flip (3D) | `flip-left` `flip-right` `flip-up` `flip-down` |
| Rotate | `rotate-left` `rotate-right` |
| Clip (reveal) | `clip-up` `clip-down` `clip-left` `clip-right` `clip-circle` |

## Options (data attributes)

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `data-nar-reveal-delay` | milliseconds | `0` | Wait before playing |
| `data-nar-reveal-duration` | milliseconds | `800` | Animation length |
| `data-nar-reveal-distance` | pixels | `200` | Travel distance of slide / zoom / bounce. On the element **or any wrapper** |
| `data-nar-reveal-easing` | any CSS easing, e.g. `ease-out`, `cubic-bezier(.2,.8,.2,1)`, `steps(4)` | `ease` | Animation easing. On the element **or any wrapper**. Invalid values are ignored |
| `data-nar-reveal-stagger` | milliseconds | none | On a **wrapper**: its direct children start this far apart (see below) |
| `data-nar-reveal-loop` | number or `infinite` | `1` | Total number of times it can play. After the element is scrolled more than 300px out of view it resets, so it can play again |
| `data-nar-reveal-trigger` | `early` `center` `late` | starts when it touches the viewport | When to start. On the element **or any wrapper** |

Invalid values are ignored and the default is used.

Trigger points: `early` starts slightly before the element enters, `center` when it reaches the middle band of the screen, `late` in a narrow middle band.

### Stagger

```html
<ul data-nar-reveal-stagger="120">
  <li data-nar-reveal="slide-bottom">One</li>     <!-- 0 ms -->
  <li data-nar-reveal="slide-bottom">Two</li>     <!-- 120 ms -->
  <li data-nar-reveal="slide-bottom">Three</li>   <!-- 240 ms -->
</ul>
```

- Only the wrapper's **direct children** are staggered. Nested elements keep their own delay.
- Stagger counts elements that **appear together**. In a long list, each group that scrolls into view starts again from 0, so items never wait for the whole list.
- An element's own `data-nar-reveal-delay` is added on top of its stagger offset.

## Customize with CSS

```css
:root {
  --nar-reveal-distance: 120px;          /* default travel distance (default 200px) */
  --nar-reveal-easing: cubic-bezier(.2,.8,.2,1);   /* default easing */
}
```

An attribute on an element or wrapper (`data-nar-reveal-distance`, `data-nar-reveal-easing`) wins over these CSS defaults.

Need something the attributes don't cover? Plain CSS works, e.g. repeat forever:

```html
<div data-nar-reveal="bounce-in-center" style="animation-iteration-count: infinite">…</div>
```

## Dynamic content (SPA)

After adding elements to the page, call:

```js
window.narReveal();            // whole document
window.narReveal(container);   // the container itself (if it has data-nar-reveal) and everything inside it
```

Already-initialized elements are skipped, so calling it again is safe.

## Good to know

- Slide / zoom / bounce effects start away from their final position. While they play, the page can briefly get a horizontal scrollbar. Add `overflow-x: clip` (or `hidden`) to a wrapper, e.g. `main`.
- The animation leaves nothing behind (no leftover `transform`), so your own `:hover`, `transform`, or `position: fixed` children keep working.
- Before it plays, the element is only transparent. It stays in its real position, so layout never shifts.
- With very fast scrolling (or jumping with an anchor link), elements in the narrow `center` / `late` zones can be skipped. They play when you scroll back to them.
- `data-nar-revealed` is set by the script while an element is revealed. You can use it in your own CSS, but don't set it yourself.
- Easing applies between keyframes. The `bounce-in-*` effects already have the overshoot built in, so they look best with the default easing.

## Demo and examples

[`index.html`](index.html) is the demo site: every option has a live stage you can replay. Six small pages in [`examples/`](examples) show the library on real layouts:

| Page | What it shows |
|---|---|
| `landing.html` | Wiping headline, bento features, centre-triggered steps, FAQ |
| `portfolio.html` | Case studies arriving from opposite edges, contact section |
| `dashboard.html` | Counting KPI cards, wiping charts, table rows that replay |
| `blog.html` | Gentle fades, early triggers, a long article with sticky contents |
| `ecommerce.html` | Bouncing product cards, staggered grid, sliding sale banner |
| `resume.html` | Filling skill bars, sliding timeline, print-friendly layout |

To see them, open `index.html` in a browser. A static server (for example `npx serve`) is the most reliable way, because the live previews on the demo page are loaded in frames.

The examples are only demos: all names, brands and numbers are made up, pictures are icon placeholders, and every button, link and form field is for show and does nothing. They share `examples/shared.css` and `examples/shared.js`, which Narleaf Reveal itself does not need.

## Layout (optional)

`narleaf-layout.css` is the full build of [Narleaf Layout](https://github.com/withmehmet/narleaf-layout) (MIT), a small 12-column grid. **Narleaf Reveal does not need it.** Only the demo and the examples use it, so you can leave it out of your own project.

```html
<link rel="stylesheet" href="narleaf-layout.css" />

<div class="nar-container nar-pi-auto nar-grid nar-gap-auto">
  <div class="nar-span-12 nar-span-md-6">…</div>
  <div class="nar-span-12 nar-span-md-6">…</div>
</div>
```

It gives you `container`, `grid`, `span`, `offset`, `gap` and `pi` (padding-inline) classes with `sm` / `md` / `lg` / `xl` breakpoints. See its repository for the full list.

## Files

| File | Purpose |
|---|---|
| `narleaf-reveal.css`, `narleaf-reveal.js` | The library (and `.min` versions) |
| `index.html` | Demo and documentation site |
| `examples/` | Six example pages and their shared styles |
| `narleaf-layout.css` | Grid used by the demo and examples (optional) |
| `og-image.png` | Social preview image (1200×630) |

## How it works

CSS makes elements transparent (`opacity: 0`) until the script adds `data-nar-revealed`, which starts a CSS animation. The script is a small `IntersectionObserver` wrapper: no scroll listeners, no layout reads while scrolling.

## Browser support

Needs `IntersectionObserver` and CSS custom properties inside `@keyframes`, which all current browsers have. Developed in Chromium and checked in Firefox. Reports from Safari are welcome. Where `IntersectionObserver` is missing, the content simply shows without animation.

## License

MIT
