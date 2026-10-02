import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { SheetContent } from '../../../components/ui'
import { useMemories } from '../../../context/memories'
import { useToast } from '../../../context/toast'
import { useUi } from '../../../context/ui'
import { usePhotoUrl } from '../../../hooks/usePhotoUrl'
import { useToday } from '../../../hooks/useToday'
import {
  deletePhoto,
  isQuotaError,
  savePhoto,
} from '../../../services/photoStore'
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from '../../../services/storage'
import { isDateKey, toDateKey } from '../../../utils/date'
import { compressImage } from '../../../utils/image'
import { DEFAULT_PHOTO_FOCUS } from '../../../utils/photoFocus'
import { PhotoFocusPicker } from '../components/PhotoFocusPicker'
import './memory-form.css'

interface PickedPhoto {
  file: File
  url: string
}

/** Creates a memory (`memoryId` null) or edits an existing one. */
export function MemoryFormSheet({ memoryId }: { memoryId: string | null }) {
  const { state, actions } = useMemories()
  const { closeSheet } = useUi()
  const { showToast } = useToast()
  const today = useToday()
  const existing = memoryId
    ? state.memories.find((memory) => memory.id === memoryId)
    : undefined

  const [name, setName] = useState(existing?.name ?? '')
  const [date, setDate] = useState(existing?.date ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [picked, setPicked] = useState<PickedPhoto | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [photoFocus, setPhotoFocus] = useState(
    existing?.photoFocus ?? DEFAULT_PHOTO_FOCUS,
  )
  const [saving, setSaving] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const ids = useId()

  const currentPhotoUrl = usePhotoUrl(existing?.photoId ?? null)
  const previewUrl = picked?.url ?? (removePhoto ? null : currentPhotoUrl)

  // Free the preview of a picked photo once it is replaced or the form closes.
  useEffect(() => {
    if (!picked) return
    return () => URL.revokeObjectURL(picked.url)
  }, [picked])

  const handleFileChange = () => {
    const file = fileInput.current?.files?.[0]
    if (!file) return
    setPicked({ file, url: URL.createObjectURL(file) })
    setRemovePhoto(false)
    setPhotoFocus(DEFAULT_PHOTO_FOCUS)
  }

  const handleRemovePhoto = () => {
    setPicked(null)
    setRemovePhoto(true)
    if (fileInput.current) fileInput.current.value = ''
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (saving) return
    const trimmedName = name.trim()
    if (!trimmedName) {
      showToast('Escribe un nombre para el evento')
      return
    }
    if (!isDateKey(date)) {
      showToast('Elige la fecha del evento')
      return
    }

    setSaving(true)
    try {
      let photoId = existing?.photoId ?? null
      let oldPhotoId: string | null = null
      if (picked) {
        let blob: Blob
        try {
          blob = await compressImage(picked.file)
        } catch {
          blob = picked.file
        }
        oldPhotoId = photoId
        photoId = await savePhoto(blob)
      } else if (removePhoto) {
        oldPhotoId = photoId
        photoId = null
      }

      const data = {
        name: trimmedName,
        date,
        description: description.trim(),
        photoId,
        photoFocus: photoId ? photoFocus : DEFAULT_PHOTO_FOCUS,
      }
      if (existing) actions.updateMemory(existing.id, data)
      else actions.addMemory(data)
      if (oldPhotoId) deletePhoto(oldPhotoId).catch(() => {})

      closeSheet()
      showToast(existing ? 'Evento actualizado' : 'Evento guardado')
    } catch (error) {
      showToast(
        isQuotaError(error)
          ? 'Se alcanzó el límite de almacenamiento'
          : 'No se pudo guardar. Intenta de nuevo.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <SheetContent
      title={existing ? 'Editar evento' : 'Nuevo evento'}
      onClose={closeSheet}
    >
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor={`${ids}-photo`}>Foto (opcional)</label>
          {previewUrl ? (
            <PhotoFocusPicker
              src={previewUrl}
              alt={picked ? 'Foto seleccionada' : 'Foto actual'}
              focus={photoFocus}
              onChange={setPhotoFocus}
            />
          ) : (
            <button
              type="button"
              className="photo-pick"
              onClick={() => fileInput.current?.click()}
            >
              <span>Toca para elegir una foto</span>
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            id={`${ids}-photo`}
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          {previewUrl && (
            <div className="photo-actions">
              <button
                type="button"
                className="link-btn neutral"
                onClick={() => fileInput.current?.click()}
              >
                Cambiar foto
              </button>
              <button
                type="button"
                className="link-btn"
                onClick={handleRemovePhoto}
              >
                Quitar foto
              </button>
            </div>
          )}
        </div>
        <div className="field">
          <label htmlFor={`${ids}-name`}>Nombre del evento</label>
          <input
            type="text"
            id={`${ids}-name`}
            maxLength={NAME_MAX_LENGTH}
            placeholder="Ej. Nuestro aniversario"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${ids}-date`}>Fecha</label>
          <input
            type="date"
            id={`${ids}-date`}
            max={toDateKey(today)}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`${ids}-description`}>Descripción (opcional)</label>
          <textarea
            id={`${ids}-description`}
            maxLength={DESCRIPTION_MAX_LENGTH}
            placeholder="Algo que quieras recordar de ese día…"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={closeSheet}>
            Cancelar
          </button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar evento'}
          </button>
        </div>
      </form>
    </SheetContent>
  )
}
