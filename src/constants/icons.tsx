import type { ReactNode } from 'react'

/** Stroke icons drawn on a 24×24 grid. */
export const UI_ICONS = {
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />,
} satisfies Record<string, ReactNode>

export type UiIconName = keyof typeof UI_ICONS

export const isUiIconName = (value: unknown): value is UiIconName =>
  typeof value === 'string' && Object.hasOwn(UI_ICONS, value)
