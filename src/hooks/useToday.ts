import { useEffect, useMemo, useState } from 'react'
import { parseDateKey, todayKey } from '../utils/date'

const CHECK_INTERVAL_MS = 60_000

/**
 * Today's local midnight. Updates when the day changes, so the counters stay
 * right when the app is left open or resumed on another day.
 */
export function useToday(): Date {
  const [key, setKey] = useState(todayKey)

  useEffect(() => {
    const refresh = () => setKey(todayKey())
    const timer = setInterval(refresh, CHECK_INTERVAL_MS)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return useMemo(() => parseDateKey(key), [key])
}
