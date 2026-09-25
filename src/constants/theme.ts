import type { ThemePreference } from '../types'

/** Browser UI (status bar) color for each resolved theme; matches `--bg`. */
export const THEME_COLORS: Record<
  Exclude<ThemePreference, 'system'>,
  string
> = {
  light: '#F6F5F1',
  dark: '#161513',
}
