import { getImageCacheInstance } from './ImageCache'

export function cacheImages(images: string[] | undefined) {
  if (!images || images.length === 0) return

  const imageCache = getImageCacheInstance()
  return imageCache.all(images)
}
