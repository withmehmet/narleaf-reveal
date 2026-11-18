/* Shared behaviour for the example pages. Nothing here is needed by Narleaf Reveal itself. */

// Shown as a preview card on the demo site? Let the CSS hide the demo bar.
if (self !== top) document.documentElement.classList.add('embedded');

// Links marked data-demo (mail, contact, sign in, PDF...) are examples only: they do nothing.
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-demo]')) e.preventDefault();
});

// Buttons and fields are visual only: they hover, focus and look pressed like real controls,
// but nothing happens. (The mobile menu button is navigation, so it keeps working.)
document.addEventListener('click', (e) => {
  if (e.target.closest('button:not([data-menu-toggle]), input[type="submit"], input[type="button"]')) e.preventDefault();
}, true);
document.addEventListener('submit', (e) => e.preventDefault(), true);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input:not([type="submit"]):not([type="button"]), textarea').forEach((el) => { el.readOnly = true; });
  document.querySelectorAll('select').forEach((el) => {
    el.addEventListener('mousedown', (e) => { e.preventDefault(); el.focus(); });
    el.addEventListener('keydown', (e) => { if (e.key !== 'Tab') e.preventDefault(); });
  });
  document.querySelectorAll('[data-demo]').forEach((el) => { if (!el.title) el.title = 'Demo link: does nothing'; });

  // Mobile menu: a real button with aria-expanded, closes on Escape and after a link is chosen
  document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  });

  // Mark the nav link of the section in view (aria-current)
  const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (targets.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => {
          if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach((t) => io.observe(t));
  }
});
