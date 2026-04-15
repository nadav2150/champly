/** Display minor units (e.g. agorot for ILS) as a decimal string without currency symbol. */
export function minorUnitsToDecimalString(minorUnits: number): string {
  return (minorUnits / 100).toFixed(2);
}

/** Parse user decimal input into minor units (agorot / cents). */
export function parseDecimalToMinorUnits(input: string): number {
  const n = parseFloat(input.replace(/[^\d.]/g, ''));
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
}

export const SUPPORTED_CURRENCIES = ['ILS', 'USD', 'EUR', 'GBP'] as const;
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function currencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code as CurrencyCode] ?? code;
}
