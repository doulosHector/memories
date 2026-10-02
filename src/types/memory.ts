/** Calendar date in `YYYY-MM-DD` format, in local time. */
export type DateKey = string

/**
 * Point of a photo that stays visible when it is cropped, as percentages of
 * its width (`x`) and height (`y`), from 0 to 100.
 */
export interface PhotoFocus {
  x: number
  y: number
}

export type ThemePreference = 'system' | 'light' | 'dark'

/** An important event the user wants to remember. */
export interface Memory {
  id: string
  name: string
  date: DateKey
  description: string
  /** Key of the photo in the photo store, if the memory has one. */
  photoId: string | null
  photoFocus: PhotoFocus
  createdAt: number
}

export interface Settings {
  theme: ThemePreference
}

export interface MemoriesState {
  memories: Memory[]
  settings: Settings
}
