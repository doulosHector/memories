import type { ReactNode } from 'react'
import './EmptyState.css'

interface EmptyStateProps {
  title: string
  children?: ReactNode
}

export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
