# Manirou Pasargad website demo

A static Persian (RTL) website for Manirou Pasargad, a Tehran engineering company that designs, supplies equipment for and builds power transmission lines and high-voltage substations. It is plain HTML, CSS and vanilla JavaScript, with no build step and no dependencies.

This repository is a demo of the production site. The product data, the five service descriptions, nine of the twelve project cards, the certificates, the appreciation letters and the contact details are placeholders. Placeholder copy contains `متن نمونه` ("sample text") or `عنوان پروژه` ("project title"), so a text search finds the text. The certificate and letter files are grey "SAMPLE" images, named `sample-01.jpg` to `sample-13.jpg` for the letters.

## Quick start

```bash
cd Manirou_Project
python -m http.server 8000
```

Open `http://localhost:8000`. Any static file server works.

Most pages also open straight from disk. The exceptions are `products.html` and `product-detail.html`, which load `assets/data/products.json` with `fetch()`, and most browsers block that on `file://`. Use a local server for those two.

## Pages

| Page | Contents | Extra scripts |
| --- | --- | --- |
| `index.html` | Hero, company summary with four feature cards, auto-scrolling services slider, four headline numbers | `infinity-slider.js` |
| `pages/about.html` | Company story, six values in a slider, five certificate cards (ISO 9001, ISO 14001, ISO 45001, IMS, HSE-MS) with an image and a PDF each, 13 appreciation letters in a lightbox. The images and PDFs are placeholders | `infinity-slider.js`, `appreciation-lightbox.js` |
| `pages/services.html` | Five service cards, a five-step work process (planning, engineering, procurement, installation, completion), four reasons to choose the company | none |
| `pages/products.html` | Product catalog built from `products.json`, with search, filters, sorting and pagination | `catalog.js` |
| `pages/product-detail.html` | One product, picked with `?slug=`: summary, specs table, PDF datasheet preview, description and a link to the contact page. Marked `noindex, follow` | `product-detail.js` |
| `pages/gallery.html` | Twelve project cards that open a modal viewer | `projects-gallery.js` |
| `pages/contact.html` | Phone, email, address and working-hours cards, plus the message form | `contact-form.js` |
| `pages/catalog.html` | Reference copy of the catalog layout, used for the Django hand-off. Marked `noindex, nofollow`, disallowed in `robots.txt` and not linked from other pages | `catalog.js` |

Every page also loads `smooth-scroll.js`, `back-to-top.js`, `menu.js` and `scroll-reveal.js`.

## Catalog and product data

`assets/data/products.json` is an array of product objects. The demo has eight, split across three categories.

| Field | Meaning |
| --- | --- |
| `slug` | Unique, URL-safe id. The detail page URL is `product-detail.html?slug=<slug>`. |
| `name` | Product name. |
| `code` | Product code (SKU), shown on the card and the detail page and matched by search. |
| `category` | `{ "slug": "towers", "name": "دکل‌های برق" }`. A plain string also works. |
| `type` | `standard` or `custom`. Missing values count as `standard`. |
| `icon` | Placeholder icon used when there is no image: `tower`, `insulator`, `cross-arm`, `clamp`, `concrete-base`, `cable` or `junction-box` (the default). |
| `short_description` | Text on the card. |
| `description` | Long text on the detail page. The section is hidden when empty. |
| `image` | Main image path. An empty value shows the placeholder icon. |
| `gallery` | Extra image paths, shown as thumbnails under the main image. Hidden when empty. |
| `specs` | Array of `{ "label": "...", "value": "..." }`, rendered as a table. Hidden when empty. |
| `datasheet_url` | PDF path. Turns on the embedded preview, the download link and the button at the top of the page. |
| `is_active` | `false` removes the product from the list and makes its detail page show "not found". |

Image and PDF paths are used as written and resolve against the page, so from `pages/` they start with `../assets/`.

How the catalog behaves:

- Eight cards per page, with page numbers in Persian digits.
- Search is case-insensitive and matches the name or the code.
- "Newest" keeps the order of the file. The two name sorts use Persian collation.
- A click anywhere on a card opens the product.
- If the JSON fails to load, the page shows the empty state.
- The category and type dropdowns in `products.html` are hard-coded. The categories are `towers`, `equipment` and `accessories`; a new category needs a new `<option>`.

To add a product, append an object to `products.json` with a unique `slug`. No HTML changes are needed.

## Project gallery

`pages/gallery.html` has twelve `.project-card` elements, three with real photos (Golgohar 400 kV line, Kamalabad 63 kV substation, Najafabad 63 kV line) and nine placeholders. Each card carries its content in data attributes, and the modal reads them:

```html
<article class="project-card reveal"
  data-title="..." data-location="..." data-year="..."
  data-type="..." data-description="..."
  data-images='["../assets/images/gallery/a.jpg","../assets/images/gallery/b.jpg"]'>
  ...
  <button type="button" class="project-view-btn">...</button>
</article>
```

The modal has previous and next buttons with a slide transition, a counter, dots and arrows for projects with several photos, and a fullscreen view of the current photo. Cards without `data-images` show their SVG placeholder.

Keyboard and touch behavior:

- `Esc` closes the fullscreen view first, then the modal.
- The arrow keys follow the RTL layout: left goes to the next project, right to the previous one.
- `Tab` stays inside the dialog, and focus returns to the button that opened it.
- Swiping sideways changes project. Swiping down closes the fullscreen view.

## Contact form

The form sends JSON to [Web3Forms](https://web3forms.com), which emails the message to the address verified for your access key. There is no backend. The visible Subject field becomes the email subject.

To set it up, create a key at web3forms.com and replace `YOUR_WEB3FORMS_ACCESS_KEY` in the hidden `access_key` input in `pages/contact.html`.

Validation runs in the browser when a field loses focus, and again on each keystroke once a field is marked invalid:

| Field | Rule |
| --- | --- |
| `name` | At least 2 characters |
| `phone` | 8 to 15 characters from `0-9 + - ( )` and spaces |
| `email` | Simple `name@host.tld` pattern |
| `subject` | At least 3 characters |
| `message` | At least 10 characters |

On submit the first invalid field gets focus, the button is disabled while the request runs, and the form clears after a successful send. A hidden `botcheck` checkbox acts as a spam trap.

## Theme, layout and typography

- The default theme is always light. The operating system's dark-mode setting is ignored. The header button switches to dark and saves the choice in `localStorage` under `maniro-theme`.
- A small inline script in each page's `<head>` sets `data-theme` before first paint, so a saved dark theme does not flash white.
- Colors, shadows, radii, container width (1180 px) and header height (76 px) are CSS custom properties in `css/base/style.css`, with dark overrides under `[data-theme="dark"]`. The accent is `#0ea5e9` in light and `#38bdf8` in dark.
- The font is Vazirmatn (FD build, Persian digits) in nine weights as `woff2`, declared in `css/base/font.css` with `font-display: swap`.
- Spacing uses logical properties, so the layout flips correctly for RTL.
- The header is sticky with a blurred translucent background. Below 900 px the navigation becomes a dropdown menu.
- The most common breakpoints are 960, 760, 640 and 480 px.
- The CSS uses `color-mix()`, `backdrop-filter` and logical properties, so the target is current evergreen browsers.

## Scripts

All scripts are classic (non-module) IIFEs written with `var`.

| File | What it does |
| --- | --- |
| `base/menu.js` | Theme toggle and mobile menu. The menu closes on link click, outside click and `Esc`, and the buttons keep `aria-expanded` and `aria-pressed` in sync. |
| `base/smooth-scroll.js` | Eases mouse-wheel scrolling and animates `#anchor` jumps, and exposes `window.maniroScrollTo()` while doing so. It skips all of that on touch devices and when reduced motion is requested. Separately, it restores the scroll position when you come back to a page: the position is saved in `sessionStorage`, and the script keeps retrying for three seconds or until you scroll. An element with `data-native-scroll` opts out of the smoothing; no page uses it yet. |
| `base/back-to-top.js` | Shows the button after 400 px of scrolling. |
| `base/infinity-slider.js` | Endless auto-scrolling card strip at 75 px/s for `#servicesSlider` (home) and `#valuesSlider` (About). It clones the cards, pauses on hover and focus, shows 1, 2 or 3 cards at up to 640 px, up to 960 px and wider, and stands still when reduced motion is requested. |
| `base/scroll-reveal.js` | Adds `.is-visible` to `.reveal` elements once they enter the viewport. The `--reveal-delay` custom property staggers them. Without `IntersectionObserver`, or with reduced motion, everything shows immediately. |
| `pages/about/appreciation-lightbox.js` | Opens the appreciation letters full size. `Esc` closes it and focus returns to the trigger. |
| `pages/catalog/catalog.js` | Loads the JSON, renders the cards, handles filters, sorting and pagination. |
| `pages/product-detail/product-detail.js` | Finds the product by `slug` and fills the detail page. |
| `pages/gallery/projects-gallery.js` | The project modal and fullscreen viewer. |
| `pages/contact/contact-form.js` | Validation and the Web3Forms request. |

## Performance and accessibility

Performance:

- The home page hero image is preloaded with `fetchpriority="high"` and served as WebP at 900 and 1600 px wide, with a JPEG fallback. The About image on the home page follows the same pattern at 600 and 1000 px.
- On the home page, the font, base, header and responsive stylesheets block rendering. The other stylesheets load through `rel="preload"` and switch on load, with a `<noscript>` fallback. Inner pages load their CSS normally.
- On the home page, images below the fold are lazy-loaded and every image declares `width` and `height`. Inner pages are less consistent about both.

Accessibility:

- Each page has a skip link to `#main-content`, and landmarks and buttons carry Persian `aria-label` text.
- Focus is always visible, and form errors use `role="alert"` with `aria-invalid`.
- The modal and lightboxes trap focus and restore it on close.
- CSS and JavaScript both respect `prefers-reduced-motion`.
- Pages declare `lang="fa" dir="rtl"`.

## SEO and sharing

- Every page has a title and meta description. All except `product-detail.html` and `catalog.html` also have a canonical link and Open Graph and Twitter tags.
- `robots.txt` disallows all crawling, because this is a demo. It does not point to the sitemap. The comment inside it holds the rules to use at launch.
- `sitemap.xml` is prepared for launch with the six public pages on the placeholder domain `https://example.com`. Product detail pages are not in it, and they are marked `noindex`.
- `assets/favicon/` holds the ICO, 16, 32 and 48 px PNGs, the Apple touch icon, the 192 and 512 px Android icons and `site.webmanifest` (standalone display, `#0ea5e9` theme color, `fa` and `rtl`). The manifest uses root-absolute paths, so the site should be served from the domain root.

## Project structure

```
manirou-demo/
├── index.html
├── pages/                    about, services, products, product-detail,
│                             gallery, contact, catalog
├── catalog/
│   └── item-template.html    Django template fragment for one catalog card
├── css/
│   ├── base/                 font, style (tokens and resets), responsive, reveal
│   ├── layout/               header, footer, back-to-top
│   └── pages/                home, about, services, catalog, product-detail,
│                             gallery, contact (one folder each)
├── js/
│   ├── base/                 shared scripts
│   └── pages/                about, catalog, product-detail, gallery, contact
├── assets/
│   ├── data/products.json
│   ├── favicon/
│   ├── fonts/webfonts/       Vazirmatn FD, nine weights
│   ├── icons/stockholm/      PNG icons in six sizes
│   ├── images/               appreciations, certificates, gallery, hero, logo
│   └── pdf/certificates/
├── robots.txt
└── sitemap.xml
```

The CSS and JavaScript files are committed minified, and there is no separate source folder. Edit them in place, or run them through a formatter first.

The pages only use the 48x48 icons. The other five sizes are unreferenced.

## Before you publish

1. Set the domain. Three spellings are in use today: `index.html` has a `manirou.com` canonical and `og:url` but a `your-domain.com` share image, every inner page uses `your-domain.com`, and `sitemap.xml` uses `example.com`. Pick one lowercase domain and list every occurrence with:

   ```bash
   grep -rn "https://your-domain.com\|https://example.com\|https://manirou.com" \
     --include=*.html --include=*.xml --include=*.txt .
   ```

2. Replace `robots.txt` with the launch rules written in its comment, and add the `Sitemap` line.
3. Add your Web3Forms access key (see [Contact form](#contact-form)).
4. Replace the placeholder content: the contact details (the footer on every page and `pages/contact.html`), the certificate images and PDFs, the 13 letter images in `assets/images/appreciations/` (and their `alt` text in `pages/about.html`), the five cards in `pages/services.html`, the "Technical Equipment" intro in `pages/products.html`, project cards 4 to 12 in `pages/gallery.html`, and all eight products in `products.json`, including their specs.
5. Fill in the footer social links. All four (Telegram, Instagram, LinkedIn, WhatsApp) are `#` on every page.
6. Choose a share image. Every page uses the square logo (750 x 766) for Open Graph and Twitter, while the Twitter card type is `summary_large_image`, which suits a wide image better.

## Known issues

- `contact-form.js` checks whether the key equals `YOUR_ACCESS_KEY_HERE`, but the placeholder in `contact.html` is `YOUR_WEB3FORMS_ACCESS_KEY`. With the placeholder still in place, the "form is not configured" message never appears. The request goes out and the form shows whatever error Web3Forms returns.
- The phone rule accepts Latin digits only, so a number typed with Persian digits is rejected.
- The type filter offers "custom", but no product uses it, so picking it shows the empty state.

## Django hand-off

`catalog/item-template.html` is a Django template fragment. It holds the same card markup as `pages/catalog.html`, with template tags in place of sample data:

- a `{% for item in catalog_items %}` loop with an `{% empty %}` state
- the placeholder SVG when `item.image` is missing
- a commented-out pagination block for the `page_obj` of Django's `Paginator`

The comments in the file, written in Persian, list the model fields the card expects: `name`, `slug`, `category` (foreign key or choices), `short_description`, `code`, `image` and `get_absolute_url()`. The card has no price, stock or cart controls, by design. The same comments say the empty-state block should be rendered on the server instead of by `catalog.js`.

`products.json` stands in for the database until then. Its fields match that model and add `description`, `specs`, `gallery`, `datasheet_url`, `type`, `icon` and `is_active`. Once Django serves the catalog and project pages, generate `sitemap.xml` from a view so those pages are included.

## Differences from the full site

- The access key in `contact.html` is a placeholder, and so are the phone, fax, email, address and postal code (`021-00000000`, `info@example.com` and similar).
- The icon folder holds only the 28 icons the pages use.
- There are no cache-header or server configuration files.

## Credits

Typeface: Vazirmatn. Icons: the Stockholm set in `assets/icons/stockholm/`. Check each license before commercial reuse.
