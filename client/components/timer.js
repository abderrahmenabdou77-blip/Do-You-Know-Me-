// Timer component
class GameTimer {
  constructor(seconds, onTick, onExpire) {
    this.total = seconds;
    this.remaining = seconds;
    this.onTick = onTick;
    this.onExpire = onExpire;
    this.intervalId = null;
    this.expired = false;
  }

  start() {
    this.expired = false;
    this.intervalId = setInterval(() => {
      this.remaining--;
      if (this.onTick) this.onTick(this.remaining, this.total);
      if (this.remaining <= 0) {
        this.stop();
        this.expired = true;
        if (this.onExpire) this.onExpire();
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(seconds) {
    this.stop();
    this.total = seconds;
    this.remaining = seconds;
    this.expired = false;
  }

  static render(remaining, total) {
    const pct = Math.max(0, (remaining / total) * 100);
    const isWarning = pct < 50;
    const isDanger = pct < 20;
    const fillClass = isDanger ? 'danger' : isWarning ? 'warning' : '';

    return `
      <div class="timer-wrap">
        <div class="timer-bar-track">
          <div class="timer-bar-fill ${fillClass}" style="width:${pct}%"></div>
        </div>
        <div class="timer-text ${isDanger ? 'danger' : ''}">${remaining}s</div>
      </div>
    `;
  }

  static update(el, remaining, total) {
    if (!el) return;
    const pct = Math.max(0, (remaining / total) * 100);
    const isWarning = pct < 50;
    const isDanger = pct < 20;
    const fillClass = isDanger ? 'danger' : isWarning ? 'warning' : '';

    const fill = el.querySelector('.timer-bar-fill');
    const text = el.querySelector('.timer-text');
    if (fill) {
      fill.style.width = pct + '%';
      fill.className = `timer-bar-fill ${fillClass}`;
    }
    if (text) {
      text.textContent = remaining + 's';
      text.className = `timer-text ${isDanger ? 'danger' : ''}`;
    }
  }
}
