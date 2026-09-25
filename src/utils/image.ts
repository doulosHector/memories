const MAX_SIDE = 1600
const JPEG_QUALITY = 0.85

/** Scales an image down to at most 1600px per side and re-encodes it as JPEG. */
export const compressImage = (file: Blob): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > MAX_SIDE || height > MAX_SIDE) {
        const ratio = Math.min(MAX_SIDE / width, MAX_SIDE / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error('canvas'))
        return
      }
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
