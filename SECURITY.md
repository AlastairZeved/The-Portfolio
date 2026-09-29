# Security

The-Portfolio is a static, single-file HTML page. There is no backend, no
account, no sync, no analytics, and no tracking anywhere.

## Network calls

Exactly one: the Parking Lot's contact form POSTs to Formspree. Nothing else
leaves the page.

- Formspree's reCAPTCHA is on by default and runs on Formspree's side; it
  adds no third-party script to the page. Do not add a second captcha.
- The form uses the standard `_gotcha` honeypot (`type="text"`, visually
  hidden via CSS, **not** `type="hidden"`).
- The site must never set `Referrer-Policy: no-referrer` or `same-origin`:
  Formspree files every submission as spam when the referrer is missing,
  which would silently brick the form.
- Do not set "Restrict to Domain" on the Formspree form: it reads the
  visitor's `Referer`, and browsers that strip the header make every
  submission file as spam.

## Hosting

The deploy-branch topology: Netlify production = the `deploy` branch. The
repository root is the publish root — treat every committed file as public
(e.g. this README and the `docs/` records are public by design).

## Reporting

Security issues → GitHub Security Advisory, never a public issue.
