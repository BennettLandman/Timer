export const MAX_SECONDS = 999 * 60 + 59;
export function validDuration(minutes, seconds) {
  const m = Number(minutes), s = Number(seconds);
  if (!Number.isInteger(m) || !Number.isInteger(s) || m < 0 || m > 999 || s < 0 || s > 59) return null;
  const total = m * 60 + s;
  return total > 0 ? total : null;
}
export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
export class Timer {
  constructor(now = () => Date.now()) { this.now = now; this.state = 'idle'; this.initial = 300; this.held = 300; this.elapsed = 0; }
  start(seconds) { this.initial = seconds; this.held = seconds; this.elapsed = 0; this.deadline = this.now() + seconds * 1000; this.state = 'running'; }
  remaining() { return this.state === 'running' ? Math.max(0, (this.deadline - this.now()) / 1000) : this.held; }
  update() { if (this.state === 'running' && this.remaining() <= 0) { this.held = 0; this.state = 'completed'; return true; } return false; }
  pause() { if (this.state !== 'running') return; this.held = this.remaining(); this.state = 'paused'; }
  resume() { if (this.state !== 'paused') return; this.deadline = this.now() + this.held * 1000; this.state = 'running'; }
  restart() { this.start(this.initial); }
  add(seconds) { if (!['running', 'paused', 'completed'].includes(this.state)) return; const next = Math.min(MAX_SECONDS, this.remaining() + seconds); if (this.state === 'running') this.deadline = this.now() + next * 1000; else { this.held = next; if (this.state === 'completed') { this.state = 'running'; this.deadline = this.now() + next * 1000; } } }
  phase() { const r = Math.min(60, this.initial / 6); const t = this.remaining(); return t <= r ? 'red' : t <= r * 3 ? 'yellow' : 'green'; }
}
