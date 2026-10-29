# DN Wedding — Wedding Invitation Website

**Live site:** https://nutdollar.netlify.app

A responsive one-page wedding invitation for a real couple, built with plain HTML, CSS and vanilla JavaScript. No framework, no build step, no backend. It is deployed on Netlify from this GitHub repository and is shared with guests as a link, including a share preview for LINE and Facebook.

## What this project shows

The site was taken from a visual mockup to a deployed product: layout, interaction, content, share preview and hosting. These are the points a reviewer can verify directly in the code.

**Front-end engineering**
- Responsive layout with CSS Grid and Flexbox, from small phones to desktop. The navigation becomes a hamburger menu on small screens (`css/responsive.css`).
- Design tokens as CSS custom properties (colours, fonts, spacing). The CSS is split by purpose: `style.css` (base and components), `animations.css` (motion), `responsive.css` (breakpoints).
- Decorative flowers are hand-built SVG symbols defined once in `index.html` and reused in every corner, so decoration adds no extra image requests.
- Thai typography with web fonts (Noto Serif Thai, Noto Sans Thai, Cormorant Garamond, Pinyon Script).

**JavaScript, no libraries** (`js/`)
- **Countdown** to the first ceremony. The target time carries an explicit UTC+07:00 offset, so the countdown is correct for guests in any time zone (`countdown.js`).
- **Photo gallery** with swipe, arrow buttons and keyboard support, plus a full-screen viewer built on the native `<dialog>` element (`gallery.js`).
- **Add to Google Calendar** link generated from the wedding date and address in the config (`main.js`).
- **Copy address** button using the Clipboard API, with a fallback that selects the text when the API is unavailable.
- **Scroll-reveal** animations with `IntersectionObserver`, an opening "seal" cover, and an optional background-music button that only starts after the guest taps, because browsers block autoplay.
- Gallery, map, song, date and links are all driven by one config file (`config.js`), so content changes do not require touching the logic.

**Accessibility and robustness**
- Semantic landmarks and headings, Thai `aria-label`s on controls, descriptive `alt` text on photos, visible keyboard focus.
- `prefers-reduced-motion` switches every animation off.
- Without JavaScript the cover never appears and all content stays visible.
- Deep links such as `/#location` skip the opening cover.

**Performance and delivery**
- All photos are WebP, below-the-fold images use lazy loading, and the hero image is preloaded.
- Open Graph and Twitter meta tags with a 1200×630 preview image.
- Git history with one commit per feature, and Netlify deployment from GitHub.

## Tech stack

HTML5 · CSS3 (Grid, Flexbox, custom properties, SVG) · JavaScript (ES6+, no dependencies) · WebP images · Google Fonts · Git and GitHub · Netlify

## Project structure

```text
index.html          page structure and text content
css/
  style.css         base styles and components
  animations.css    opening sequence, scroll reveal, countdown tick
  responsive.css    tablet and phone layouts
js/
  config.js         date, links, music, song and gallery (edit here)
  countdown.js      live countdown
  gallery.js        swipe gallery and full-screen viewer
  main.js           cover, music, mobile menu, calendar link, map, copy address, dress code
assets/
  images/           WebP photos and the share preview
  icons/            favicon
```

## Credits and how this was built

This project was built with AI assistance, and the roles are stated openly:

| Role | Who / what |
|------|------------|
| Project planning, software and system architecture design, and review | **Jenjira Huaisai** |
| Visual design and wedding image generation | ChatGPT (image generation) |
| Code writing (HTML, CSS, JavaScript) | Claude (Anthropic) |

Jenjira defined the requirements and the structure of the site (sections, configuration-driven content, deployment on Netlify from GitHub). She also reviewed the generated code and decided what to change, accept or ship. The wedding photos on the site are AI-generated illustrations, not real photographs, unless a caption says otherwise.

Contact: https://www.jenjirahuaisai.com

---

# Owner guide

Everything below is for maintaining the site.

## Guest experience
1. **Opening cover:** the guest taps the D&N seal, the card lifts away and music starts (if a song is set).
2. **Hero:** names, date, live countdown to the first ceremony (09.09 น.) and an add-to-Google-Calendar link, with the couple photo on the right.
3. **Ceremony schedule** with illustrated icons.
4. **Swipe gallery:** the centered photo is in focus. Tap it to open full-screen, then swipe, use the arrows or press Esc.
5. **Location:** photo, address, Google Maps button, copy-address button and a small map (a real embedded map if `googleMapsEmbedUrl` is set).
6. **Our song** card, **dress code** (tap the swatches) and a thank-you footer with the hashtag and the apology line from the printed card.

A link straight to a section (e.g. `…/#location`) skips the cover. On phones the menu is behind the hamburger button.

## Editing
- **Text** (names, parents, schedule, address shown on the page): `index.html`
- **Date, links, music, song, gallery:** `js/config.js`
  - `googleMapsUrl`: the couple's pinned share link. Until it's set, the button searches for the village name.
  - `googleMapsEmbedUrl`: optional inline map (the `src` URL from Google Maps → Share → Embed a map).
  - `musicFile`: e.g. `assets/audio/song.mp3`. The music button appears only when this is set.
  - `songTitle`, `songArtist`, `songLink`: the song card. If `songLink` is empty the card opens a Spotify search.
  - `spotifyEmbedUrl`: optional. When set, the song card is replaced by a Spotify player.
  - `gallery`: list of `{ src, alt }`.
- **Photos:** `assets/images/` (WebP). `hero-couple.webp` is the hero, `story-bg.webp` the story background, `location.webp` the location photo, `photo-01…10.webp` the gallery, `og-cover.jpg` the share preview (1200×630). Replace `location.webp` with a photo of the venue when you have one.
- **Unused files:** `hero.webp`, `portrait.webp` and `gallery-1…4.webp` belong to the previous design and are no longer used. They can be deleted.
- **RSVP button:** it scrolls to the thank-you section. To collect replies, change `href="#thanks"` on the two RSVP links in `index.html` to your LINE or form link.

## Before sharing the link
- [ ] The `og:` meta tags in `index.html` point to https://nutdollar.netlify.app.
- [ ] Add the pinned Google Maps link.
- [ ] Add the song file, or leave it empty (no music button).
- [ ] The couple approves every photo.
- [ ] Check the credit link in the footer.
- [ ] Send the link to yourself in LINE and check the preview image. LINE caches previews, so add `?v=2` to the link if an old image shows.

## Deploy (Netlify)
1. Push this folder to a GitHub repository.
2. Netlify → Add new project → Import from GitHub. Leave the build command empty and set the publish directory to `/`.