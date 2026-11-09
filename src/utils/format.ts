/** Formatting helpers — grams, centimetres, temperature, timers. */

/** Grams: one decimal below 100 g, whole grams above. */
export function grams(value: number): string {
  if (!isFinite(value) || value <= 0) {
    return '0';
  }
  return value < 100 ? value.toFixed(1) : String(Math.round(value));
}

export function cm(value: number): string {
  return value.toFixed(1);
}

export function mm(value: number): string {
  return value.toFixed(1);
}

export function pct(value: number): string {
  return value % 1 === 0 ? String(value) : value.toFixed(1);
}

/** Temperatures are plain ASCII — no degree glyph (rule #15). */
export function tempC(value: number): string {
  return String(Math.round(value));
}

export function clock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return h + ':' + pad(m) + ':' + pad(sec);
}

export function hours(totalSeconds: number): string {
  return (totalSeconds / 3600).toFixed(1);
}

export function shortDate(ts: number): string {
  const d = new Date(ts);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return d.getDate() + ' ' + months[d.getMonth()];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Snaps a raw value to the slider step and kills float drift. */
export function snap(value: number, min: number, max: number, step: number): number {
  const stepped = Math.round((value - min) / step) * step + min;
  const decimals = step < 1 ? 1 : 0;
  return Number(clamp(stepped, min, max).toFixed(decimals));
}
