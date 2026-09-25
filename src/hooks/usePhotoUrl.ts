import { useEffect, useState } from 'react'
import { getPhotoUrl, peekPhotoUrl } from '../services/photoStore'

interface LoadedPhoto {
  id: string
  url: string | null
}

/** Object URL for a stored photo; `null` while loading or if it is missing. */
export function usePhotoUrl(photoId: string | null): string | null {
  const [loaded, setLoaded] = useState<LoadedPhoto | null>(null)

  useEffect(() => {
    if (!photoId || peekPhotoUrl(photoId)) return
    let cancelled = false
    getPhotoUrl(photoId)
      .catch(() => null)
      .then((url) => {
        if (!cancelled) setLoaded({ id: photoId, url })
      })
    return () => {
      cancelled = true
    }
  }, [photoId])

  if (!photoId) return null
  return peekPhotoUrl(photoId) ?? (loaded?.id === photoId ? loaded.url : null)
}
