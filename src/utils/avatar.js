// Centre-crops an image file to a square and resizes it to a small JPEG data URL (stored on the user record)
export const AVATAR_SIZE = 256
export const MAX_SOURCE_BYTES = 5 * 1024 * 1024

export const imageFileToAvatar = (file, size = AVATAR_SIZE, quality = 0.85) => new Promise((resolve, reject) => {
  if (!file?.type?.startsWith('image/')) return reject(new Error('Choose an image file'))
  if (file.size > MAX_SOURCE_BYTES) return reject(new Error('Image must be 5 MB or smaller'))

  const url = URL.createObjectURL(file)
  const image = new Image()
  image.onload = () => {
    const side = Math.min(image.naturalWidth, image.naturalHeight)
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    // White behind transparent PNGs, since JPEG has no alpha
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, size, size)
    context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, size, size)
    URL.revokeObjectURL(url)
    resolve(canvas.toDataURL('image/jpeg', quality))
  }
  image.onerror = () => {
    URL.revokeObjectURL(url)
    reject(new Error('That file could not be read as an image'))
  }
  image.src = url
})
