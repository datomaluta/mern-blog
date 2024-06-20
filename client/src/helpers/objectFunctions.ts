export function getObjectLength<T extends object>(obj: T) {
  let count = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ in obj) {
    count++;
  }
  return count;
}

export const removeEmpty = (obj: any) => {
  const result: { [key: string]: any } = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== "") {
      result[key] = value;
    }
  }
  return result;
};
