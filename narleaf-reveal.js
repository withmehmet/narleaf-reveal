/*!
 * Narleaf Reveal — tiny scroll-triggered reveal animations (JS part). MIT License.
 * Adds/removes `data-nar-revealed` on `[data-nar-reveal]` elements. CSS does the rest.
 */
(() => {
  const P = 'data-nar-reveal';        // attribute prefix: data-nar-reveal, data-nar-reveal-delay, …
  const SELECTOR = `[${P}]`;
  const REVEALED = 'data-nar-revealed';
  const RESET_PX = 300; // how far outside the viewport before an element may replay

  // Trigger zones as [top, bottom] fractions of the viewport height.
  const BANDS = {
    default: [0, 1],        // as soon as it touches the viewport
    early: [-0.2, 1.2],     // slightly before it enters
    center: [0.35, 0.65],   // when it reaches the middle band
    late: [0.45, 0.55],     // narrow middle band
  };

  const state = new WeakMap(); // element -> { n: plays so far, max: allowed plays, base: delay ms, step: stagger ms }
  const observers = {};

  const getObserver = (key, margin, onEntries) =>
    (observers[key] ??= new IntersectionObserver(onEntries, { rootMargin: margin }));

  const stop = (el) => Object.values(observers).forEach((o) => o.unobserve(el));

  // Non-negative integer from a data-nar-reveal-* attribute, or null if missing/invalid
  const num = (el, name) => {
    const n = parseInt(el?.getAttribute(`${P}-${name}`), 10);
    return n >= 0 ? n : null;
  };

  // Value of a data-nar-reveal-* attribute on the element or its nearest wrapper
  const inherited = (el, name) => el.closest(`[${P}-${name}]`)?.getAttribute(`${P}-${name}`);

  // `seen` counts how many children of each stagger wrapper start in this same batch
  const play = (el, seen) => {
    const s = state.get(el);
    if (el.hasAttribute(REVEALED) || s.n >= s.max) return;
    if (s.step !== null) {
      const parent = el.parentElement;
      const k = seen.get(parent) ?? 0;
      seen.set(parent, k + 1);
      el.style.animationDelay = s.base + k * s.step + 'ms';
    }
    el.setAttribute(REVEALED, '');
    if (++s.n >= s.max) stop(el); // played its last time: nothing more to watch
  };

  const reveal = (entries) => {
    const seen = new Map();
    for (const e of entries) if (e.isIntersecting) play(e.target, seen);
  };

  const reset = (entries) => {
    for (const e of entries) if (!e.isIntersecting) e.target.removeAttribute(REVEALED);
  };

  const inBand = (el, [top, bottom]) => {
    const r = el.getBoundingClientRect();
    return r.bottom > top * innerHeight && r.top < bottom * innerHeight && r.right > 0 && r.left < innerWidth;
  };

  const maxPlays = (el) => {
    const v = el.getAttribute(`${P}-loop`);
    if (v === 'infinite') return Infinity;
    return parseInt(v, 10) > 0 ? parseInt(v, 10) : 1;
  };

  const init = (scope = document) => {
    const seen = new Map();
    const found = [...scope.querySelectorAll(SELECTOR)];
    if (scope.matches?.(SELECTOR)) found.unshift(scope); // the container itself counts too

    for (const el of found) {
      if (state.has(el)) continue;
      const base = num(el, 'delay') ?? 0;
      state.set(el, { n: 0, max: maxPlays(el), base, step: num(el.parentElement, 'stagger') });

      const duration = num(el, 'duration');
      if (duration !== null) el.style.animationDuration = duration + 'ms';
      el.style.animationDelay = base + 'ms';

      // distance and easing can sit on the element or on any wrapper
      const distance = num(el.closest(`[${P}-distance]`), 'distance');
      if (distance !== null) el.style.setProperty('--nar-reveal-distance', distance + 'px');

      const easing = inherited(el, 'easing');
      if (easing && CSS.supports('animation-timing-function', easing)) el.style.animationTimingFunction = easing;

      // trigger can sit on the element or on any wrapper
      const named = inherited(el, 'trigger');
      const mode = BANDS[named] ? named : 'default';
      const band = BANDS[mode];
      const margin = `${Math.round(-band[0] * 100)}% 0px ${Math.round((band[1] - 1) * 100)}% 0px`;

      getObserver('in:' + mode, margin, reveal).observe(el);
      // Leaving the (extended) viewport resets the element so it can play again
      getObserver('far', `${RESET_PX}px 0px`, reset).observe(el);

      // Already in the trigger zone on load: show now, no flash of hidden content
      if (inBand(el, band)) play(el, seen);
    }
  };

  const boot = () => {
    const root = document.documentElement;
    try {
      if (!('IntersectionObserver' in window)) throw new Error('no IntersectionObserver');
      init();
      window.narReveal = init; // call after adding elements dynamically (SPA)
      root.setAttribute(`${P}-ready`, '');
    } catch (err) {
      root.setAttribute(`${P}-fallback`, ''); // CSS shows everything
    }
  };

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();
