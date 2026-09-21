# Nammaweb AI Research Labs — Fellowship Portal

Single-page portal for the **Applied Generative AI Systems Fellowship (AGAI-SF)** — a six-month
one-to-one programme run by Nammaweb AI Research Labs, Bengaluru.
DPIIT recognised (DIPP199820) · ISO 21001:2018 certified.

The site is **plain HTML, CSS and JavaScript**. There is no build step, no package install and no
server code, so it cannot fail a build on any host.

---

## What is inside

```
index.html                  the whole portal
404.html                    styled not-found page
favicon.ico
robots.txt
vercel.json                 Vercel static config (caching + clean URLs)
.nojekyll                   tells GitHub Pages to serve the folder as-is
.github/workflows/
  deploy-pages.yml          one-click GitHub Pages deployment
assets/
  css/styles.css            all styling
  js/data.js                curriculum, roles, schedule, notes, library content
  js/app.js                 auth gate, localStorage, rendering, payment, toasts
  img/nammaweb-logo.png     brand mark (transparent)
  img/dpiit-recognition.jpg DPIIT Certificate of Recognition
  img/iso-21001.jpg         ISO 21001:2018 Certificate of Registration
  img/favicon-64.png, apple-touch-icon.png
```

---

## Run it locally

Double-click `index.html`, or serve the folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com → **Add New… → Project** → import the repository.
3. Framework preset: **Other**. Build command: leave empty. Output directory: leave empty (root).
4. **Deploy**.

Or from the terminal:

```bash
npm i -g vercel
vercel --prod
```

## Deploy to GitHub Pages

1. Push the folder to a repository, branch `main`.
2. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow publishes on every push to `main`.

The site uses only relative paths, so it works both at a domain root and under
`https://<user>.github.io/<repo>/`.

Any other static host (Netlify, Cloudflare Pages, S3, Hostinger, cPanel) works the same way —
upload the folder contents to the web root.

---

## Mentee login

| Field | Value |
| --- | --- |
| Username | `srinivas` (or `name`) |
| PIN | `9241` |

Signing in sets `nw_session_v1` in `localStorage` and unlocks the Mentee Command Centre: assignment
submissions, the 1:1 schedule, the reference library, capstone architecture diagrams and the
mentor's notes. A persistent status bar appears at the top of the page.

> This is a client-side gate for a private portal, not real security. Everything in the protected
> section is already in the page source. Do not put confidential material there. If you later need
> real access control, move the protected content behind a small API and replace the check in
> `assets/js/app.js`.

## Data stored in the browser

| Key | Holds |
| --- | --- |
| `nw_session_v1` | login state |
| `nw_progress_v1` | which of the 24 weeks are ticked off |
| `nw_assignments_v1` | submitted repositories and benchmarks |
| `nw_payment_v1` | recorded UPI transaction reference |

Nothing is transmitted anywhere. Clearing site data resets all of it.

---

## Payments

| | |
| --- | --- |
| Programme fee | ₹45,000 in full, or ₹25,000 Phase 1 milestone |
| UPI ID | `mallikarjunns007-1@oksb` |
| GPay / PhonePe | 9241527429 |
| Payee name | Nammaweb AI Research Labs |

The QR code is generated at runtime from the selected amount using the public
`api.qrserver.com` endpoint. If that service is unreachable the panel falls back to showing the UPI
ID and mobile number, so the page never breaks. To remove the external dependency entirely, save a
QR image into `assets/img/` and point `#upi-qr` at it.

The "Confirm payment" form only records a reference locally for the mentor to verify. It is not a
payment gateway and does not move money.

---

## Editing the content

Almost everything readable is in `assets/js/data.js`:

- `NW.brand` — names, fee, UPI details
- `NW.modules` — the six modules and all 24 weeks (title, summary, bullet points, deliverable)
- `NW.roles` — the career-outcome cards
- `NW.schedule`, `NW.notes`, `NW.library`, `NW.assignmentSeed` — command-centre content

Change the text there and reload; nothing needs rebuilding.

Colours live as CSS custom properties at the top of `assets/css/styles.css`
(`--teal-800: #006059`, `--emerald: #10b981`, `--cyan: #06b6d4`, the slate scale).

---

## Notes on the certificate

The certificate section is a preview. The verification hash is derived in the browser from the
candidate, programme code and DPIIT number — it is a display value, not a signed credential.
"Print or save as PDF" prints the certificate alone via a print stylesheet.

---

© Nammaweb LLP. The DPIIT and ISO certificate images belong to Nammaweb LLP and are reproduced here
by the owner.

---

## `standalone.html`

The same portal compiled into **one self-contained file** — CSS, JavaScript, the logo and both
certificate images are all inlined. Email it, put it on a USB stick or open it offline; it needs no
other file to work. The multi-file version at `index.html` is the one to host and to edit.
