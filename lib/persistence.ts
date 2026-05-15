import { get, set } from "idb-keyval";

export async function loadPersisted<T>(key: string, fallback: T): Promise<T> {
  if (typeof window === "undefined") return fallback;
  try {
    const v = await get<T>(key);
    return (v as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function savePersisted<T>(key: string, value: T): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await set(key, value);
  } catch {
    // best-effort
  }
}
