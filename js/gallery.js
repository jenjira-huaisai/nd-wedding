(() => {
  const photos = window.WEDDING_CONFIG.gallery || [];
  const section = document.getElementById("gallery");
  const track = document.getElementById("gallery-track");
  const count = document.getElementById("gallery-count");
  if (!photos.length) { section.hidden = true; return; }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = n => String(n).padStart(2, "0");
  const total = photos.length;

  photos.forEach((photo, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "slide";
    btn.setAttribute("aria-label", `ดูภาพที่ ${i + 1} ขนาดใหญ่`);
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    btn.append(img);
    btn.addEventListener("click", () => {
      if (i !== active) { go(i); return; } // first tap centers, second opens
      openLightbox(i);
    });
    track.append(btn);
  });
  const slides = [...track.children];

  let active = 0;
  function centerOf(el) { return el.offsetLeft + el.offsetWidth / 2; }
  function nearest() {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    slides.forEach((s, i) => { if (Math.abs(centerOf(s) - mid) < Math.abs(centerOf(slides[best]) - mid)) best = i; });
    return best;
  }
  function setActive(i) {
    active = i;
    slides.forEach((s, j) => s.classList.toggle("is-active", j === i));
    count.textContent = `${pad(i + 1)} / ${pad(total)}`;
  }
  function go(i) {
    i = (i + total) % total;
    const s = slides[i];
    track.scrollTo({ left: centerOf(s) - track.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
    setActive(i);
  }

  let raf = 0;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => setActive(nearest()));
  }, { passive: true });
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
  });
  document.getElementById("gallery-prev").addEventListener("click", () => go(active - 1));
  document.getElementById("gallery-next").addEventListener("click", () => go(active + 1));
  setActive(0);
  addEventListener("load", () => go(0), { once: true });

  // Lightbox
  const box = document.getElementById("lightbox");
  const boxImg = document.getElementById("lightbox-img");
  const boxCount = document.getElementById("lb-count");
  let current = 0;
  function show(i) {
    current = (i + total) % total;
    boxImg.src = photos[current].src;
    boxImg.alt = photos[current].alt || "";
    boxCount.textContent = `${pad(current + 1)} / ${pad(total)}`;
  }
  function openLightbox(i) {
    show(i);
    if (typeof box.showModal === "function") box.showModal(); else box.setAttribute("open", "");
  }
  function closeLightbox() {
    if (typeof box.close === "function") box.close(); else box.removeAttribute("open");
    go(current);
  }
  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", () => show(current - 1));
  document.getElementById("lb-next").addEventListener("click", () => show(current + 1));
  box.addEventListener("click", e => { if (e.target === box) closeLightbox(); });
  box.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });
  box.addEventListener("close", () => go(current));

  // Swipe inside the lightbox
  let startX = null;
  box.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
