import { useCallback, type ReactNode } from 'react'
import { MemoriesProvider } from '../context/memories'
import { ToastProvider, useToast } from '../context/toast'
import { UiProvider } from '../context/ui'

function PersistedMemoriesProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast()
  const handleSaveError = useCallback(
    () => showToast('Se alcanzó el límite de almacenamiento'),
    [showToast],
  )
  return (
    <MemoriesProvider onSaveError={handleSaveError}>
      {children}
    </MemoriesProvider>
  )
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PersistedMemoriesProvider>
        <UiProvider>{children}</UiProvider>
      </PersistedMemoriesProvider>
    </ToastProvider>
  )
}
