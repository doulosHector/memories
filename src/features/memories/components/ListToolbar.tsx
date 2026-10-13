import { Icon } from '../../../components/ui'
import type { SortOrder } from '../../../types'

interface ListToolbarProps {
  query: string
  onQueryChange: (query: string) => void
  sortOrder: SortOrder
  onToggleSort: () => void
}

/** Search by title and newest/oldest toggle above the list. */
export function ListToolbar({
  query,
  onQueryChange,
  sortOrder,
  onToggleSort,
}: ListToolbarProps) {
  const isNewest = sortOrder === 'newest'
  return (
    <div className="list-toolbar">
      <label className="search-field">
        <Icon name="search" size={16} />
        <input
          type="search"
          placeholder="Buscar por título"
          aria-label="Buscar por título"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <button
        type="button"
        className="btn ghost sort-btn"
        onClick={onToggleSort}
        title="Invertir el orden"
        aria-label={`Orden: ${isNewest ? 'más recientes' : 'más antiguos'} primero. Invertir el orden`}
      >
        <Icon name="sort" size={16} />
        {isNewest ? 'Recientes' : 'Antiguos'}
      </button>
    </div>
  )
}
