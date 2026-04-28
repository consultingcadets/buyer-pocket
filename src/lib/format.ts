/**
 * Format an Australian mobile number: "0412345678" → "0412 345 678"
 * Strips non-digits then inserts spaces at positions 4 and 7.
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
}

/**
 * Parse a formatted dollar amount to a number.
 * "$1,234" → 1234, "" or null-like → null
 */
export function parseAmount(value: string): number | null {
  if (!value || !value.trim()) return null;
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return null;
  const n = parseInt(digits, 10);
  return isNaN(n) ? null : n;
}

/**
 * Format a raw numeric string with commas for display.
 * "1234" → "1,234", "" → ""
 */
export function formatAmount(value: string): string {
  if (!value || !value.trim()) return "";
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("en-AU");
}
