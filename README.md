# Diksha & Abhas · Wedding Invitation (Angular)

The animated wedding invitation (envelope intro, falling petals, countdown, events,
RSVP and venue map) as a Angular project.

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm start
```

Then open http://localhost:4200 in your browser.

## Where to edit things

| What you want to change | File |
|---|---|
| Names, parents, date, venue on the first screen | `src/app/sections/hero.component.html` |
| Envelope screen ("You're Invited") | `src/app/sections/envelope.component.html` |
| Couple cards and favourites | `src/app/sections/couple.component.html` |
| Event names, dates, timings and colours | `src/app/sections/events.component.ts` |
| Families | `src/app/sections/families.component.html` |
| RSVP form and deadline text | `src/app/sections/rsvp.component.html` |
| Venue and Google Map | `src/app/sections/venue.component.html` |
| Footer | `src/app/sections/footer.component.html` |
| Countdown date, petals, sparkle, envelope on/off | `src/app/config.ts` |
| Colours, sizes, spacing | `src/styles.css` |
| Animations (petals, reveal, music, countdown) | `src/app/effects.ts` |

Styles were converted from the original inline styles into CSS classes named after
their section (`hero-3`, `events-12`, ...). Search for the class name used in a
component to find its style.

### Adding photos
The groom and event photo boxes are placeholders. Put your photo in
`public/images/` and replace the placeholder `<div class="... slot slot--empty">`
with the `<img>` line given in the comment just above it.

### Background music
1. Put your song in `public/audio/`, for example `public/audio/wedding-song.mp3`
   (MP3 works in every browser; keep it under ~5 MB so it loads quickly).
2. In `src/app/config.ts` set `musicSrc: 'audio/wedding-song.mp3'` (no leading slash).
   `musicVolume` sets the loudness (0–1).

The song loops and starts when the guest taps the envelope. Browsers block sound
until the visitor taps something, so it can't start before that. Guests can pause
it with the music button in the corner. Turn off `musicOnOpen` to start it only
from that button.

### Save RSVPs to a spreadsheet (Google Sheets → Excel)
Each RSVP is saved as a new row: time, name, attending, guests, days, note, side,
bringing someone, attendee names and travel.

1. Go to [sheets.new](https://sheets.new) to create a Google Sheet, for example "Wedding RSVPs".
2. In the sheet, open **Extensions → Apps Script**. Delete the code there, paste in
   everything from `google-sheet/Code.gs`, and click **Save**.
3. Click **Deploy → New deployment**, click the gear icon, and choose **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy**, allow the permissions (choose your account →
   *Advanced* → *Go to project* → *Allow*), and copy the **Web app URL**
   (it ends in `/exec`).
4. Paste that URL into `rsvpSheetUrl` in `src/app/config.ts`, then push to GitHub.

Send a test RSVP from the live site. A new **RSVPs** tab appears with your row.
To get an Excel file at any time: **File → Download → Microsoft Excel (.xlsx)**.

If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version**
so the same URL keeps working.

## Publish on GitHub Pages

1. Create a new repository on GitHub and push this folder to the `main` branch.
2. In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes the site
   on every push. Your link will be `https://<your-username>.github.io/<repo-name>/`.

## Build manually

```bash
npm run build
```
The finished site is in `dist/wedding-invite/browser/` — upload that folder to any static host.
