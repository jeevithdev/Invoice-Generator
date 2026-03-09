const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHANUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomChar(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

function randomDigits(length: number): string {
  return Array.from({ length }, () => randomChar('0123456789')).join('');
}

function randomLetters(length: number): string {
  return Array.from({ length }, () => randomChar(LETTERS)).join('');
}

// GSTIN checksum as per base36 weighted sum algorithm.
function gstinCheckDigit(body14: string): string {
  let factor = 1;
  let sum = 0;

  for (let i = body14.length - 1; i >= 0; i -= 1) {
    const codePoint = ALPHANUM.indexOf(body14[i]);
    const product = codePoint * factor;
    sum += Math.floor(product / 36) + (product % 36);
    factor = factor === 1 ? 2 : 1;
  }

  const checkCodePoint = (36 - (sum % 36)) % 36;
  return ALPHANUM[checkCodePoint];
}

export function generateRandomGSTIN(stateCode?: string): string {
  const state = /^\d{2}$/.test(stateCode ?? '') ? stateCode! : randomDigits(2);
  const pan = `${randomLetters(5)}${randomDigits(4)}${randomLetters(1)}`;
  const entityCode = randomChar(ALPHANUM);
  const fixed = 'Z';
  const body14 = `${state}${pan}${entityCode}${fixed}`;
  const checksum = gstinCheckDigit(body14);
  return `${body14}${checksum}`;
}
