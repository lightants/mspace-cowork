# MSpace Coworking

Standalone site for the **physical coworking & study space** in M’lang — desks by the hour, plus conference / meeting requests inside MSpace.

This is **not** the Multispaces marketplace project (`/workspace/mspace-site`). Do not mix the two.

## Open the site

From this folder:

```bash
cd /workspace/mspace-cowork
python3 -m http.server 4173
```

Then visit:

- Home: http://127.0.0.1:4173/index.html
- Desk booking: http://127.0.0.1:4173/book.html
- Conference booking: http://127.0.0.1:4173/conference.html

Or open the HTML files directly in a browser. Pages are static HTML / CSS / JS. No build step.

## What’s real (verified)

- **Product:** MSpace Coworking — one space, not a city marketplace
- **Desk rate:** ₱50 / hour
- **Discount:** 10% for students and teachers (shown on the home pricing section; the desk form applies it when role is Student or Teacher)
- **Location:** 2nd Floor, Aqua Verde Commercial Building, M’lang (Mlang), North Cotabato, Philippines
- **Hours posted:** 9:00 AM–6:00 PM
- **Amenities (public IG):** air-conditioning, high-speed Wi-Fi, free coffee, spacious, clean/quiet, food allowed, brownout-ready, walk-ins
- **Meetings:** solo / dual / team / business — bookable as a conference inside MSpace
- **Instagram:** https://www.instagram.com/mspacemind/
- **Logo:** official stacked gold/white M on black, copied from `/workspace/mspace-site/assets/logo-official.png` (not redrawn)
- **Payment:** cashless — official GCash “SCAN TO PAY HERE” poster (merchant **MSpace**) at checkout. **No cash.** File: `assets/gcash-qr.png` (used as-is; no GCash number invented or unmasked)

## What’s TBD (not invented)

- **Conference / meeting-room rate** — labeled **Rate TBD / we’ll confirm the rate**. No peso number.
- **Days of the week** — hours are posted 9am–6pm; the site does **not** fake a weekly calendar.
- **GCash verification** — this site records a reservation only. It does **not** verify GCash automatically.
- **Phone and email** — none listed. Contact via Instagram if needed.
- **Interior photos** — scene SVGs are **placeholders**, labeled as such.

## Booking flows

### Desk (`book.html`)

1. Pick date, start, and end (slots inside 9:00 AM–6:00 PM).
2. Choose role (student, teacher, VA, freelancer, startup, entrepreneur, other).
3. Name + mobile **or** email.
4. Live total: **₱50 × hours**, minus **10%** if student or teacher.
5. Submit → **GCash checkout**: official QR poster, amount due (₱50/hour, 10% off students/teachers), and **cashless only — scan GCash to pay. No cash.** Reservation details stay on the screen.

### Conference (`conference.html`)

1. Date, start, end, party size, meeting type (solo/dual/team/business).
2. Name + mobile **or** email, optional notes.
3. Summary shows **Rate TBD** — never a fake price.
4. Submit → **GCash checkout**: same official QR. Pay the **confirmed** amount via GCash — no cash, no invented conference peso price.

## Previews

- `previews/desktop.png` — home, desktop
- `previews/mobile.png` — home, mobile
- `previews/book.png` — desk checkout with GCash QR
- `previews/checkout.png` — closer shot of the GCash confirm screen

## Brand

Futuristic-minimalist, 2026. Near-black canvas, white type, geometric sans (Outfit) + IBM Plex Mono labels. Logo gold used only as a thin accent (hairlines, one CTA, focus rings). Square / 2px radius. Not the Multispaces marketplace look.
