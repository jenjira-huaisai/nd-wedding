(() => {
  const config = window.WEDDING_CONFIG;
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = id => document.getElementById(id);

  // ---- Mobile menu ----
  const burger = $("burger");
  const drawer = $("drawer");
  function setMenu(open) {
    drawer.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "ปิดเมนู" : "เปิดเมนู");
  }
  burger.addEventListener("click", () => setMenu(!drawer.classList.contains("open")));
  drawer.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  // ---- Music ----
  const audio = $("bg-music");
  const musicBtn = $("music-toggle");
  const hasMusic = Boolean(config.musicFile);
  if (hasMusic) { audio.src = config.musicFile; musicBtn.hidden = false; }
  function setPlaying(on) {
    musicBtn.classList.toggle("is-playing", on);
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "ปิดเพลง" : "เปิดเพลง");
  }
  function playMusic() {
    if (!hasMusic) return;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }
  musicBtn.addEventListener("click", () => {
    if (audio.paused) playMusic(); else { audio.pause(); setPlaying(false); }
  });

  // ---- Opening cover ----
  const cover = $("cover");
  const seal = $("seal");
  function openCard() {
    if (root.classList.contains("is-open")) return;
    root.classList.add("is-open");
    cover.classList.add("is-opening");
    playMusic(); // allowed: started by the guest's tap
    const finish = () => { cover.hidden = true; root.classList.remove("is-locked"); };
    if (reduce) finish(); else setTimeout(finish, 1100);
  }
  seal.addEventListener("click", openCard);
  cover.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCard(); } });
  seal.focus({ preventScroll: true });
  // A link straight to a section (e.g. …/#location) skips the cover.
  if (location.hash && location.hash.length > 1) {
    root.classList.add("is-open");
    cover.hidden = true;
    root.classList.remove("is-locked");
  }

  // ---- Scroll reveal ----
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add("is-visible"));
  }

  // ---- Add to calendar (Google Calendar) ----
  const toCal = iso => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  $("calendar-link").href = "https://calendar.google.com/calendar/render?action=TEMPLATE"
    + "&text=" + encodeURIComponent(config.calendarTitle)
    + "&dates=" + toCal(config.weddingDate) + "/" + toCal(config.calendarEnd)
    + "&location=" + encodeURIComponent(config.address);

  // ---- Map ----
  $("maps-link").href = config.googleMapsUrl
    || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(config.mapSearchQuery || config.address);
  if (config.googleMapsEmbedUrl) {
    const frame = document.createElement("iframe");
    frame.src = config.googleMapsEmbedUrl;
    frame.title = "แผนที่สถานที่จัดงาน";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allowFullscreen = true;
    const box = $("map-box");
    box.replaceChildren(frame);
    box.removeAttribute("role");
    box.removeAttribute("aria-label");
  }

  // ---- Song: link card by default, Spotify player when spotifyEmbedUrl is set ----
  const songCard = $("song-card");
  if (config.spotifyEmbedUrl) {
    const frame = document.createElement("iframe");
    frame.src = config.spotifyEmbedUrl;
    frame.title = "เพลงของเรา (Spotify)";
    frame.loading = "lazy";
    frame.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    $("spotify-container").replaceChildren(frame);
  } else {
    if (config.songTitle) $("song-title-text").textContent = config.songTitle;
    if (config.songArtist) $("song-artist-text").textContent = config.songArtist;
    const query = [config.songTitle, config.songArtist].filter(Boolean).join(" ");
    songCard.href = config.songLink || "https://open.spotify.com/search/" + encodeURIComponent(query);
    songCard.setAttribute("aria-label", "ฟังเพลง " + query + " ใน Spotify");
  }

  // ---- Copy address ----
  const toast = $("toast");
  let toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
  }
  $("copy-address").addEventListener("click", () => {
    const fallback = () => {
      const range = document.createRange();
      range.selectNodeContents($("address"));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      showToast("เลือกที่อยู่แล้ว กดคัดลอกได้เลย");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(config.address).then(() => showToast("คัดลอกที่อยู่แล้ว"), fallback);
    } else fallback();
  });

  // ---- Dress code swatches ----
  const swatches = document.querySelectorAll(".swatch");
  const dressText = $("dress-text");
  function renderDress(selected) {
    dressText.textContent = "ขอเชิญแต่งกายโทน ";
    swatches.forEach((b, i) => {
      if (i) dressText.append(" · ");
      const name = b.dataset.name;
      if (b === selected) { const s = document.createElement("strong"); s.textContent = name; dressText.append(s); }
      else dressText.append(name);
    });
  }
  swatches.forEach(btn => btn.addEventListener("click", () => {
    swatches.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
    renderDress(btn);
  }));
  renderDress(swatches[0]);

})();
