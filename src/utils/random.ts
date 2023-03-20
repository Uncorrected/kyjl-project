export function random(length: number): string {
  const regex = /[A-Z0-9]/;
  let result = '';
  for (let i = 0; i < length; i++) {
    const char = String.fromCharCode(
      Math.floor(Math.random() * (90 - 48 + 1)) + 48,
    );
    if (regex.test(char)) {
      result += char;
    } else {
      i--;
    }
  }
  return result;
}
