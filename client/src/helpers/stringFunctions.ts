export function textTrimmer(str: string, length: number): string {
  if (str.length > length) {
    str = `${str.substring(0, length)}...`;
  } else if (str.length < length) {
    str = `${str}`;
  }
  return `${str}`;
}
