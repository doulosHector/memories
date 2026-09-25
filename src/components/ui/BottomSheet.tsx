import { useEffect, type ReactNode } from 'react'
import { cx } from '../../utils/style'
import { Icon } from './Icon'
import { SHEET_TITLE_ID } from './sheetIds'
import './BottomSheet.css'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  /** Changes on every open so the entry animation plays again. */
  sheetKey?: number
  children: ReactNode
}

/**
 * Modal panel: a bottom sheet on phones, a centered dialog from 600px. It
 * stays mounted while closed (hidden and `inert`).
 */
export function BottomSheet({
  open,
  onClose,
  sheetKey,
  children,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <div
      className={cx('overlay', open && 'open')}
      role="dialog"
      aria-modal="true"
      aria-labelledby={SHEET_TITLE_ID}
      inert={!open}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="sheet" key={sheetKey}>
        {children}
      </div>
    </div>
  )
}

interface SheetContentProps {
  /** Visible title. Without it, the sheet body must render the element with `SHEET_TITLE_ID`. */
  title?: ReactNode
  onClose: () => void
  children: ReactNode
}

/** Header (title + close button) and body of a sheet. */
export function SheetContent({ title, onClose, children }: SheetContentProps) {
  return (
    <>
      <div className="sheet-head">
        {title ? (
          <h2 className="sheet-title" id={SHEET_TITLE_ID}>
            {title}
          </h2>
        ) : (
          <span className="sheet-title placeholder" aria-hidden="true">
            .
          </span>
        )}
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" />
        </button>
      </div>
      <div className="sheet-body">{children}</div>
    </>
  )
}
