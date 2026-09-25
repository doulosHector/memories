import { createContext } from 'react'
import type { SheetState } from '../../types'

export interface ActiveSheet {
  state: SheetState
  /** Changes on every open so sheet forms start from a clean state. */
  key: number
}

export interface UiContextValue {
  sheet: ActiveSheet | null
  isSheetOpen: boolean
  openSheet: (sheet: SheetState) => void
  closeSheet: () => void
}

export const UiContext = createContext<UiContextValue | null>(null)
