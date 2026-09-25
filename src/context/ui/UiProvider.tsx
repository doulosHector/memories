import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { SheetState } from '../../types'
import { UiContext, type ActiveSheet } from './UiContext'

export function UiProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<ActiveSheet | null>(null)
  const [isSheetOpen, setSheetOpen] = useState(false)

  const openSheet = useCallback((state: SheetState) => {
    setSheet((current) => ({ state, key: (current?.key ?? 0) + 1 }))
    setSheetOpen(true)
  }, [])

  const closeSheet = useCallback(() => setSheetOpen(false), [])

  const value = useMemo(
    () => ({ sheet, isSheetOpen, openSheet, closeSheet }),
    [sheet, isSheetOpen, openSheet, closeSheet],
  )

  return <UiContext value={value}>{children}</UiContext>
}
