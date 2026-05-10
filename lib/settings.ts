import type { UserSettings } from './critique';

const STORAGE_KEY = 'artstation-critic-settings';

export function loadSettings(): Partial<UserSettings> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<UserSettings>) : {};
  } catch {
    return {};
  }
}

export function saveSettings(settings: Partial<UserSettings>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
