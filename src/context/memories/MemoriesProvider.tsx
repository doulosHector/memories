import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import {
  isStorageAvailable,
  loadState,
  saveState,
} from '../../services/storage'
import { MemoriesContext, createMemoriesActions } from './MemoriesContext'
import { memoriesReducer } from './memoriesReducer'

interface MemoriesProviderProps {
  children: ReactNode
  /** Called when the state could not be written to localStorage. */
  onSaveError?: () => void
}

export function MemoriesProvider({
  children,
  onSaveError,
}: MemoriesProviderProps) {
  const [state, dispatch] = useReducer(memoriesReducer, undefined, loadState)
  const [storageAvailable] = useState(isStorageAvailable)

  useEffect(() => {
    // Without storage the notice already explains that nothing is saved.
    if (storageAvailable && !saveState(state)) onSaveError?.()
  }, [state, storageAvailable, onSaveError])

  const actions = useMemo(() => createMemoriesActions(dispatch), [])
  const value = useMemo(
    () => ({ state, actions, storageAvailable }),
    [state, actions, storageAvailable],
  )

  return <MemoriesContext value={value}>{children}</MemoriesContext>
}
