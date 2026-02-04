/**
 * Format price for API response: returns a number so values like 1000.00
 * serialize as 1000 (no trailing .00).
 */
export function formatPrice(price: string | number): number {
  const n = typeof price === 'string' ? parseFloat(price) : price;
  return Number.isNaN(n) ? 0 : n;
}
