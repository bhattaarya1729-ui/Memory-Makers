# Memory Makers — Photography Studio Website

A single-page website for a photography studio, built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step. Just open `index.html` in a browser.

## Design concept

A **darkroom / contact-sheet** aesthetic: deep charcoal background, warm amber "safelight" accent, and film sprocket holes running down both edges of the page. The hero opens with an aperture-iris animation, and the gallery is styled like an actual contact sheet.

---

## File structure

```
memory-makers/
├── index.html      → page structure and content
├── style.css       → all styling, design tokens, animations
├── script.js       → gallery build, sliders, carousel, form handling
├── images/         → your photos go here (see below)
└── README.md       → this file
```

All three code files reference each other by relative path, so keep them in the same folder. `index.html` also loads Google Fonts (Fraunces + Work Sans) from a CDN, so an internet connection is needed the first time it loads.

---

## Sections on the page

| Section | ID | What it is |
|---|---|---|
| Hero | `#hero` | Aperture animation, tagline, grain + light-leak overlay |
| Studio | `#about` | Studio story and stats |
| Services | `#services` | Portraits, weddings, events, product/brand pricing |
| Contact Sheet | `#gallery` | Bento-style photo grid with hover reveal |
| Before/After | `#beforeAfter` | Draggable slider comparing a raw vs. edited photo |
| Words | `#testimonials` | Auto-playing testimonial carousel |
| Book a Session | `#contact` | Inquiry form (front-end only, see note below) |

---

## Adding your own photos

### Gallery (contact sheet)

In `script.js`, find the `frames` array (near the top, inside the `DOMContentLoaded` listener). Each entry looks like:

```js
{ area: 'a', label: 'Portrait · 01', draw: '<img src="images/your-photo.jpg" alt="Describe the photo">' },
```

There are 8 slots (`a` through `h`), each tied to a differently-shaped tile in the bento grid:

- `a`, `g` → **wide** tiles — best with landscape-oriented photos
- `c`, `d`, `f` → **tall** tiles — best with portrait-oriented photos
- `e` → the **big feature** tile — use your strongest shot here
- `b`, `h` → **small** tiles — either orientation works, will be cropped to fit

**Recommended image specs:** JPG or WebP, roughly 900×600px, under 150KB each, so the page stays fast. Put the files inside an `images/` folder next to `index.html`.

### Before/After slider

In `index.html`, inside `<section id="beforeAfter">`, there are two `<img>` tags — one for the raw shot, one for the edited version of the *same* photo:

```html
<img src="images/your-raw-photo.jpg" alt="Raw, unedited photo straight out of camera">
...
<img src="images/your-edited-photo.jpg" alt="Final edited version of the same photo">
```

Right now both point at the same placeholder image, with a CSS filter faking a "flat/raw" look on the first one. Once you have a real before/after pair, replace both `src` attributes and delete this line in `style.css` (it won't be needed anymore):

```css
.ba-before img {
  filter: grayscale(0.7) contrast(0.85) brightness(0.9) saturate(0.6);
}
```

---

## Interactive features

- **Aperture animation** — pure CSS, plays once on page load.
- **Gallery parallax** — images drift slightly inside their tiles as you scroll (`initGalleryParallax()` in `script.js`). Movement is capped at 10% of each tile's height, adjustable via the `0.1` multiplier in that function.
- **Film-strip cursor trail** — small amber dots trail the cursor (`initCursorTrail()`). Automatically disabled on touch devices and for users with reduced-motion settings enabled.
- **Grain / light-leak overlay** — animated texture and warm glow, hero section only. Also respects reduced-motion.
- **Before/after slider** — drag the handle, or focus it and use arrow keys.
- **Testimonial carousel** — auto-rotates every 5.5s, pauses on hover, dots are clickable.
- **Contact form** — front-end only right now. Submitting shows a confirmation message but doesn't send anywhere yet (see below).

---

## Making the contact form actually send inquiries

Right now, `script.js` just intercepts the form submit and shows a "thanks" message — nothing is emailed or stored anywhere. To make it functional, you have a few no-backend options:

- **[Formspree](https://formspree.io)** or **[Web3Forms](https://web3forms.com)** — free tiers, just point the form's `action` at their endpoint
- **[EmailJS](https://www.emailjs.com)** — sends straight from JavaScript using their SDK
- A small serverless function (Netlify Forms, Vercel, etc.) if you're hosting on one of those platforms

Any of these just needs a few lines changed in the `contactForm` handler in `script.js` — happy to help wire one up when you're ready.

---

## Browser support & accessibility

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge).
- Respects `prefers-reduced-motion` — animations (aperture, cursor trail, grain, light-leak, gallery parallax) are disabled or reduced for users with that OS setting on.
- Keyboard-navigable: nav links, before/after slider (arrow keys once focused), and form fields all work without a mouse.
- Responsive down to mobile: nav collapses to a hamburger menu, gallery bento simplifies to 2 columns then 1, contact form stacks to a single column.

---

## Customizing colors and type

All design tokens live at the top of `style.css`:

```css
:root {
  --charcoal: #16130f;
  --amber: #c9973f;
  --amber-bright: #e0b563;
  --rust: #9c4a2e;
  --ivory: #f3ede1;
  ...
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Work Sans", ...;
}
```

Changing these values updates the whole site consistently, since every component references them rather than hardcoded colors.
