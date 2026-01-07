import { ImagePrefetcher } from '@/lib/image-prefetcher'

export function prefetchPostImages(images: string[] | undefined) {
  if (!images || images.length === 0) return

  return new ImagePrefetcher().all(images)
}
