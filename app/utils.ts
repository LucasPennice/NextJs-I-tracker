export function checkInsulinMissmatch(a: number, b: number): boolean {
  const diff = Math.abs(a - b);

  if (diff <= 1) return false;

  if (a <= 6 && b <= 6) {
    return diff > 1;
  } else if (a <= 13 && b <= 13) {
    return diff > 2;
  } else if (a <= 20 && b <= 20) {
    return diff > 3;
  }

  // If values fall outside defined ranges, default to "too big"
  return true;
}

export function clearAllCookies() {
  localStorage.clear();
}
