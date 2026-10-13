export const MAX_SIDE = 1600
const JPEG_QUALITY = 0.85
/** Bigger files are re-encoded even when they already fit. */
const MAX_ORIGINAL_BYTES = 2_500_000

/** Size scaled down (never up) so that no side is longer than `max`. */
export const fitWithin = (width: number, height: number, max = MAX_SIDE) => {
  if (width <= max && height <= max) return { width, height }
  const ratio = Math.min(max / width, max / height)
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

interface ImageInfo {
  type: string
  size: number
  width: number
  height: number
}

/**
 * A JPEG that already fits is stored as is: re-encoding it only loses
 * quality, plus the extra brightness (HDR) data that phones add to photos.
 */
export const canKeepOriginal = ({ type, size, width, height }: ImageInfo) =>
  type === 'image/jpeg' &&
  size <= MAX_ORIGINAL_BYTES &&
  width <= MAX_SIDE &&
  height <= MAX_SIDE

/**
 * Prepares a picked photo for storage: scales it down to at most 1600px per
 * side and re-encodes it as JPEG, unless it can be kept as is. JPEG has no
 * transparency, so transparent areas (PNG screenshots, logos) are painted
 * white instead of turning black.
 */
export const compressImage = (file: Blob): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const { naturalWidth, naturalHeight } = img
      if (
        canKeepOriginal({
          type: file.type,
          size: file.size,
          width: naturalWidth,
          height: naturalHeight,
        })
      ) {
        resolve(file)
        return
      }
      const { width, height } = fitWithin(naturalWidth, naturalHeight)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error('canvas'))
        return
      }
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, width, height)
      context.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('compress'))),
        'image/jpeg',
        JPEG_QUALITY,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('load'))
    }
    img.src = url
  })
