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
