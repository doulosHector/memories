import { Icon } from '../../../components/ui'
import { useUi } from '../../../context/ui'

/** Floating button that opens the form for a new memory. */
export function AddMemoryButton() {
  const { openSheet } = useUi()
  return (
    <button
      className="btn fab"
      onClick={() => openSheet({ type: 'memoryForm', memoryId: null })}
    >
      <Icon name="plus" size={16} strokeWidth={2.2} />
      Añadir evento
    </button>
  )
}
