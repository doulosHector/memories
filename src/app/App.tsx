import { AppHeader } from '../components/layout'
import { useMemories } from '../context/memories'
import { MemoriesView } from '../features/memories'
import { useDocumentTheme } from '../hooks/useDocumentTheme'
import { AppProviders } from './AppProviders'
import { SheetOutlet } from './SheetOutlet'

function AppShell() {
  const { state } = useMemories()
  useDocumentTheme(state.settings.theme)

  return (
    <>
      <div className="wrap">
        <AppHeader />
        <main>
          <MemoriesView />
        </main>
      </div>
      <SheetOutlet />
    </>
  )
}

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  )
}
