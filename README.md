# Ember & Oak Kitchen

A polished fictional Toronto restaurant portfolio demo, built with React, Vite, JavaScript, Tailwind CSS, React Router and Lucide. No backend, authentication, real reservations, payments or external form submissions.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
npm run preflight
```

Vite prints the local URL. Production output is `dist/`.

## Routes and features

- `/`: seasonal restaurant introduction and featured menu.
- `/menu`, `/order`: 24 sample dishes, combined search/category/diet filters, availability and add-to-cart.
- `/reservations`: validated demo request; only date, dinner time, guest count and reference are saved locally.
- `/cart`: quantity updates, removal, totals and versioned browser persistence.
- `/checkout`: pickup/delivery simulation, sample HST, validated delivery details and order summary. No payment inputs.
- `/about`, `/gallery`, `/contact`: fictional story, keyboard-accessible photo dialog and simulated contact form.
- Unknown paths show a 404 page.

## Privacy and limitations

Use sample form details. Names, emails, addresses and contact messages are not persisted or transmitted. Cart contents and limited reservation metadata are stored in localStorage; unavailable or corrupt storage is handled. Checkout receipts last only while the page remains mounted. Clear site storage in your browser to remove saved demo state.

Availability, hours, delivery fees, dietary information and 13% HST calculations are illustrative. Dietary tags do not establish allergen safety. Stock photos illustrate the concept and do not represent actual dishes or premises. Images are bundled locally with an SVG fallback. Google Fonts require network access; system font fallbacks are provided.

## Customize

Optional browser QA uses an existing Playwright installation and Microsoft Edge: set `PLAYWRIGHT_MODULE` to its module path if it is not installed locally, start the app, then run `node tests/browser.cjs`. Set `TEST_URL` to target a different preview URL. This checks ten routes at four widths and exercises the primary flows. `node scripts/walkthrough.cjs` records a silent walkthrough using the same settings. Screenshots and video are saved in the Git-ignored `test-results/` folder. These tools are not runtime dependencies.

Edit `src/data/menu.js` for dishes and images, `src/pages/Content.jsx` for brand content, `src/App.jsx` for navigation, and the theme tokens in `src/index.css` for styling. Pure calculations, storage and validation live in `src/utils/shop.js`. Page components are in `src/pages/` and shared controls in `src/components/`.

Images are from Unsplash and covered by its [free image license](https://unsplash.com/license). Source URLs are recorded in `src/data/menu.js`. Review and replace the illustrative photos with owned restaurant assets before production. Playfair Display and Inter are loaded through Google Fonts.

The current design uses a near-black canvas, decorative red accents, Facebook Blue action buttons, a split hero and circular food cards. Shared design tokens in `src/index.css` control the dark styling across every route. The Contact page includes an external Google Maps embed of Toronto, clearly labelled as a demo city location; it requires internet access and does not identify a real restaurant.

## Deploy to Vercel

No Vercel deployment has been performed. The existing GitHub remote is `https://github.com/awaljanhematyar/ember-oak-restaurant.git`; do not create another repository.

After the owner authorizes publishing:

1. Run `npm test`, `npm run build` and `npm run preflight`. Review `git status --short --untracked-files=all` before staging; never force-add private documents.
2. Commit and push only the reviewed implementation files to the existing GitHub repository.
3. Import that repository into Vercel using the Vite preset, install command `npm ci`, build command `npm run build`, and output directory `dist`. Use a supported Node version satisfying Vite's requirement above. No environment variables or API keys are required for this demo.
4. Deploy, then directly load and refresh `/menu`, `/reservations`, `/checkout` and an unknown route. Confirm images retain their image content types, the Toronto map loads, and the primary flows work on the live URL.

`vercel.json` declares the Vite build/output settings and SPA deep-link rewrites while retaining static asset paths. `.vercelignore` excludes private documents and local credentials from CLI source uploads. Live Vercel rewrite behavior still needs verification after deployment.

The six private planning documents and Master Prompt filename variants are ignored by Git and excluded from Vercel source uploads. `.env` files, credential/key files, local service/editor metadata, dependencies, build output and QA artifacts are excluded as appropriate. `npm run preflight` checks private-document exclusions and scans Git-eligible text files for known credential patterns without printing secret values. It does not stage files and cannot replace manual review or guarantee detection of every possible secret. Nothing should be committed or pushed until the owner requests it.

## Final quality check — 2026-10-20

- `npm test`: 9 tests passed.
- `npm run build`: succeeded; React Router emits non-fatal client-directive warnings during this client-only build.
- Production browser QA in Microsoft Edge: ten routes at 375, 768, 1024 and 1440 pixels with no horizontal overflow or observed runtime page errors. Verified internal link targets, image loading/fallback, combined menu filters, cart add/increase/decrease/remove and reload persistence, pickup/delivery checkout, reservation validation/local metadata, contact simulation, mobile navigation and gallery keyboard focus.
- Google Maps loaded its provider interface in the responsive, clearly labelled Toronto demo frame.
- Git exclusions and a known-credential-pattern scan passed before initial publication.

This is ready for portfolio-demo deployment. Safari/Firefox, assistive-technology certification and the live Vercel URL have not been tested. Reservations, orders and contact messages remain simulations; production business integrations are listed below.

## Production integrations still needed

Real inventory and availability, server-side validation, booking management, order fulfilment, consent/privacy policies, transactional messaging, rate limiting and monitoring. Payments require an approved hosted payment integration and server verification. Replace fictional contact details, review taxes and delivery rules, and verify allergen processes with the business.
