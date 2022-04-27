const UNITS = ["B", "kB", "MB", "GB", "TB", "PB", "EB"];
const BASE = 1024;
const DEFAULT_OPTIONS = { precision: 1 };

export default function humanBytes(bytes, { precision } = DEFAULT_OPTIONS) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new TypeError(`Expected a finite, positive number. Received: ${typeof bytes}: ${bytes}`);
  }

  let value = bytes;
  let unitIndex = 0;

  while (value >= BASE) {
    value /= BASE;
    unitIndex += 1;
  }

  const localizedValue = value.toLocaleString(undefined, { maximumFractionDigits: precision });

  return `${localizedValue} ${UNITS[unitIndex]}`;
}
