import { Icon } from '../ui'
import { useMemories } from '../../context/memories'
import { usePrefersDark } from '../../hooks/usePrefersDark'
import './AppHeader.css'

export function AppHeader() {
  const { state, actions } = useMemories()
  const prefersDark = usePrefersDark()
  const { theme } = state.settings
  const isDark = theme === 'system' ? prefersDark : theme === 'dark'

  return (
    <header className="app">
      <div className="brand">
        Recuer<span>dos</span>
      </div>
      <div className="header-actions">
        <button
          className="icon-btn"
          title="Cambiar tema"
          aria-label="Cambiar tema"
          onClick={() => actions.setTheme(isDark ? 'light' : 'dark')}
        >
          <Icon name={isDark ? 'sun' : 'moon'} />
        </button>
      </div>
    </header>
  )
}
