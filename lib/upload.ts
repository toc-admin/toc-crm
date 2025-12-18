import sharp from 'sharp'

export interface ImageSizes {
  thumbnail: Buffer
  medium: Buffer
  original: Buffer
}

export async function resizeImage(
  buffer: Buffer,
  fileName: string
): Promise<ImageSizes> {
  // Thumbnail: 300x300
  const thumbnail = await sharp(buffer)
    .resize(300, 300, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 80 })
    .toBuffer()

  // Medium: 800x800
  const medium = await sharp(buffer)
    .resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .toBuffer()

  // Original: max 1600x1600 (compress only)
  const original = await sharp(buffer)
    .resize(1600, 1600, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 90 })
    .toBuffer()

  return { thumbnail, medium, original }
}

export function getImageFileName(originalName: string, size: 'thumbnail' | 'medium' | 'original'): string {
  const ext = originalName.split('.').pop()
  const nameWithoutExt = originalName.replace(`.${ext}`, '')
  const sanitized = nameWithoutExt.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  return `${sanitized}-${size}.jpg`
}
