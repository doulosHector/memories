import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-color-scheme: dark)'

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/** Whether the operating system is using a dark color scheme. */
export const usePrefersDark = (): boolean =>
  useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches)
