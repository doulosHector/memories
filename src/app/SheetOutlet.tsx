import { BottomSheet } from '../components/ui'
import { useUi } from '../context/ui'
import { MemoryDetailSheet, MemoryFormSheet } from '../features/memories'
import type { SheetState } from '../types'

function SheetBody({ sheet }: { sheet: SheetState }) {
  switch (sheet.type) {
    case 'memoryForm':
      return <MemoryFormSheet memoryId={sheet.memoryId} />
    case 'memoryDetail':
      return <MemoryDetailSheet memoryId={sheet.memoryId} />
  }
}

/** Renders the active sheet inside the single, app-wide sheet. */
export function SheetOutlet() {
  const { sheet, isSheetOpen, closeSheet } = useUi()
  return (
    <BottomSheet open={isSheetOpen} onClose={closeSheet} sheetKey={sheet?.key}>
      {sheet && <SheetBody key={sheet.key} sheet={sheet.state} />}
    </BottomSheet>
  )
}
