export const entryStorageKey = "snipcode_last_entry";

export const deleteLastEntry = (): void => {
  localStorage.removeItem(entryStorageKey)
}

export const saveLastEntry = (lastEntry: string): void => {
  localStorage.setItem(entryStorageKey, lastEntry)
}

export const getLastEntry = (): string | null => {
  return localStorage.getItem(entryStorageKey);
}
