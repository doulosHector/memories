/** Calendar date in `YYYY-MM-DD` format, in local time. */
export type DateKey = string

export type ThemePreference = 'system' | 'light' | 'dark'

/** An important event the user wants to remember. */
export interface Memory {
  id: string
  name: string
  date: DateKey
  description: string
  /** Key of the photo in the photo store, if the memory has one. */
  photoId: string | null
  createdAt: number
}

export interface Settings {
  theme: ThemePreference
}

export interface MemoriesState {
  memories: Memory[]
  settings: Settings
}
