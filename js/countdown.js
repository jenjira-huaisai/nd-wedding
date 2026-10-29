(() => {
  const target = Date.parse(window.WEDDING_CONFIG.weddingDate);
  const ids = ["days", "hours", "minutes", "seconds"];
  const fields = ids.map(id => document.getElementById(id));
  const message = document.getElementById("countdown-message");
  if (!Number.isFinite(target) || fields.some(f => !f)) return;

  let lastSeconds = null;
  function update() {
    let remaining = Math.max(0, target - Date.now());
    const days = Math.floor(remaining / 86400000); remaining %= 86400000;
    const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000); remaining %= 60000;
    const seconds = Math.floor(remaining / 1000);

    fields[0].textContent = String(days);
    fields[1].textContent = String(hours).padStart(2, "0");
    fields[2].textContent = String(minutes).padStart(2, "0");
    fields[3].textContent = String(seconds).padStart(2, "0");

    if (seconds !== lastSeconds) {
      const s = fields[3];
      s.classList.remove("tick");
      void s.offsetWidth; // restart the animation
      s.classList.add("tick");
      lastSeconds = seconds;
    }

    if (Date.now() >= target) {
      message.textContent = "วันนี้คือวันสำคัญของเรา ขอบคุณที่มาร่วมยินดี";
      return true;
    }
    return false;
  }

  if (!update()) {
    const timer = setInterval(() => { if (update()) clearInterval(timer); }, 1000);
  }
})();
