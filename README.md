# The School of Phish

An interactive phishing awareness trainer. Learners work through a realistic inbox, highlight anything suspicious, decide whether each email is legitimate or phishing, and get a marked-up debrief showing exactly what gave it away.

## Features

- Realistic mail client with an inbox, collapsible sender details (From, Reply-To) and a browser-style status bar that shows where links really go
- Highlighting: click any part of an email to flag it; points for real red flags, small penalties for false alarms
- Link checking: clicking a link shows its true destination with the real domain underlined, and opening a phishing link costs points
- Marked-up debriefs with numbered red flags, linked to a field guide of 14 phishing tactics
- Rounds of 10 drawn from 27 everyday scenarios: parcel and tax refund scams, safe-account bank fraud, fake parking fines with QR codes, invoice fraud, gift card requests, and genuine emails from banks, GPs, councils and family to compare them with
- Built for shared devices: progress is kept in sessionStorage for the current session only, and an "End session" button clears everything for the next person
- Session progress tracking: scores, accuracy, and the red flag types you miss most
- Personalised certificate for scoring 75% or more in a round, printable to A4 or PDF, or downloadable as a PNG
- Light and dark themes, keyboard shortcuts (L, P, N), screen reader announcements, reduced motion support, responsive down to phone size

## Running it

No build step. Open `index.html`, or serve the folder with any static host (GitHub Pages works as-is).

## Certificate artwork

The certificate uses `assets/certificate-art.svg`. Replace that file (or change the `src` of `#cert-art` in `index.html`) to use different artwork. The certificate wording and signatory are also in `index.html`, and the pass mark is `CERT_THRESHOLD` in `app.js`.

## Adding scenarios

Emails and tactics live in `data.js` as plain objects; the format is documented at the top of that file. Email content is rendered with DOM methods rather than `innerHTML`.

Originally built for COMP1004 Computing Practice at the University of Plymouth.
