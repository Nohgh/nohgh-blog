export class ImageCache {
  private static instance: ImageCache | null = null
  private cached = new Set<string>()
  private failed = new Set<string>()

  private constructor() {}

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache()
    }
    return ImageCache.instance
  }

  static createTestInstance(): ImageCache {
    return new ImageCache()
  }

  private isValidCache(image: string) {
    if (this.cached.has(image) || this.failed.has(image)) {
      return false
    }

    return true
  }

  private cacheImage(image: string) {
    if (!this.isValidCache(image)) return

    const img = new Image()

    img.onload = () => {
      this.cached.add(image)
    }

    img.onerror = () => {
      this.failed.add(image)
    }

    img.src = image
  }

  all(images: string[]) {
    images.forEach((image) => this.cacheImage(image))
  }

  isCached(image: string) {
    return this.cached.has(image)
  }

  clear() {
    this.cached.clear()
  }

  getCachedSize() {
    return this.cached.size
  }
}

// 싱글톤 프로바이더
let ImageCacheProvider: () => ImageCache = () => ImageCache.getInstance()

// 싱글톤 인스턴스 주입
export function getImageCacheInstance(): ImageCache {
  return ImageCacheProvider()
}

// 테스트를 위한 싱글톤 인스턴스
export function setImageCacheTestInstance(instance: ImageCache): void {
  ImageCacheProvider = () => instance
}
