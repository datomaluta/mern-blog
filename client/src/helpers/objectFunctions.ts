export function getObjectLength<T extends object>(obj: T) {
  let count = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ in obj) {
    count++;
  }
  return count;
}
