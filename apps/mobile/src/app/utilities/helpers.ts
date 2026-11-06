export function removeEmptyFields<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      // Define what counts as "empty"
      return value !== null && value !== undefined && value !== '';
    })
  ) as Partial<T>;
}