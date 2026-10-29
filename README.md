# DN Wedding — Wedding Invitation Website

One-page wedding invitation for ธิดาพร (ครูนัท) & วันชนะ (ดอลลาร์), Saturday 2 January 2570 (2027).
Plain HTML/CSS/vanilla JS. No build step, no framework, no backend.

Design direction: **Minimal Luxury**. Ice-white and navy with champagne-gold hairlines, and the couple photo leads full-screen.

## Guest experience
1. **Opening cover:** the guest taps the D&N seal, the card lifts away and music starts (if a song is set).
2. **Hero:** the photo reveals bottom-up with a slow zoom and drifting gold dust. *Dollar & Nat* writes in letter by letter, then a gold line and the date appear.
3. **Invitation:** both families' parents, the couple's full names and nicknames.
4. **Live countdown** to the first ceremony (09.09 น.), plus an add-to-Google-Calendar link.
5. **Ceremony schedule** with line icons.
6. **Swipe gallery:** the centered photo is in focus. Tap it to open full-screen, then swipe, use the arrows or press Esc.
7. **Location:** the photo background moves with a gentle parallax. Google Maps button, copy-address button, optional inline map.
8. **Dress code:** tap the swatches. Footer has the hashtag and the apology line from the printed card.

A link straight to a section (e.g. `…/#location`) skips the cover. With reduced motion turned on, every animation is switched off. Without JavaScript the cover never shows and all content stays visible.

## Editing
- **Text** (names, parents, schedule, address shown on the page): `index.html`
- **Date, links, music, gallery:** `js/config.js`
  - `googleMapsUrl`: the couple's pinned share link. Until it's set, the button searches for the village name.
  - `googleMapsEmbedUrl`: optional inline map (the `src` URL from Google Maps → Share → Embed a map).
  - `musicFile`: e.g. `assets/audio/song.mp3`. The music button appears only when this is set.
  - `spotifyEmbedUrl`: optional Spotify player section. It appears only when this is set.
  - `gallery`: list of `{ src, alt }`.
- **Photos:** `assets/images/` (WebP). `portrait.webp` is the phone hero, `hero.webp` the desktop hero, `og-cover.jpg` the share preview (1200×630).

## Before sharing the link
- [ ] Replace `https://YOUR-SITE.netlify.app` in the `og:` meta tags in `index.html` with the real URL, so LINE and Facebook show the preview image.
- [ ] Add the pinned Google Maps link.
- [ ] Add the song file, or leave it empty (no music button).
- [ ] The couple approves every photo (the images are edited/generated from their own photo).
- [ ] Check the credit link in the footer.

## Deploy (Netlify)
1. Push this folder to a GitHub repository.
2. Netlify → Add new project → Import from GitHub. Leave the build command empty and set the publish directory to `/`.
