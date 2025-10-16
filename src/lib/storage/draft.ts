type Json = Record<string, unknown>

const STORAGE_PREFIX = 'netz-subs-draft:'

export function saveDraft<T extends Json>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
  } catch {}
}

export function loadDraft<T extends Json>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function clearDraft(key: string) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {}
}

