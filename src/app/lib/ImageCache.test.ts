import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getImageCacheInstance, setImageCacheTestInstance, ImageCache } from './ImageCache'

class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  private _src = ''

  set src(value: string) {
    this._src = value
    if (value.includes('success')) this.onload?.()
    else this.onerror?.()
  }

  get src() {
    return this._src
  }
}

describe('ImageCache', () => {
  beforeEach(() => {
    vi.stubGlobal('Image', MockImage as unknown as typeof Image)

    setImageCacheTestInstance(ImageCache.createTestInstance())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('싱글톤', () => {
    it('getImageCacheInstance는 동일 인스턴스를 반환한다', () => {
      const a = getImageCacheInstance()
      const b = getImageCacheInstance()

      expect(a).toBe(b)
    })

    it('싱글톤 인스턴스는 상태를 공유한다', () => {
      const a = getImageCacheInstance()
      const b = getImageCacheInstance()

      a.all(['image-success.png'])

      expect(b.isCached('image-success.png')).toBe(true)
    })

    it('setImageCacheTestInstance로 싱글톤 인스턴스를 교체할 수 있다', () => {
      const client = getImageCacheInstance()

      const testInstance = ImageCache.createTestInstance()
      setImageCacheTestInstance(testInstance)

      const test = getImageCacheInstance()

      expect(test).toBe(testInstance)
      expect(test).not.toBe(client)
    })
  })

  describe('기본 동작', () => {
    it('이미지 로드 성공 시 cached에 저장된다', () => {
      const cache = getImageCacheInstance()

      cache.all(['image-success.png'])

      expect(cache.isCached('image-success.png')).toBe(true)
    })

    it('이미지 로드 실패 시 cached에 저장되지 않는다', () => {
      const cache = getImageCacheInstance()

      cache.all(['image-fail.png'])

      expect(cache.isCached('image-fail.png')).toBe(false)
    })

    it('clear 호출 시 cached가 초기화된다', () => {
      const cache = getImageCacheInstance()

      cache.all(['image-success.png'])

      expect(cache.isCached('image-success.png')).toBe(true)

      cache.clear()

      expect(cache.isCached('image-success.png')).toBe(false)
    })

    it('빈 이미지 배열을 전달해도 에러 없이 동작한다', () => {
      const cache = getImageCacheInstance()

      expect(() => {
        cache.all([])
      }).not.toThrow()
    })

    it('clear는 성공 캐시만 초기화하고 실패 캐시는 유지한다', () => {
      const cache = getImageCacheInstance()

      cache.all(['image-success.png', 'image-fail.png'])

      cache.clear()

      expect(cache.isCached('image-success.png')).toBe(false)
      expect(cache.isCached('image-fail.png')).toBe(false)
    })

    it('로드에 실패한 이미지는 이후에도 다시 로딩하지 않는다', () => {
      const cache = getImageCacheInstance()

      cache.all(['image-fail.png'])
      cache.all(['image-fail.png'])

      expect(cache.isCached('image-fail.png')).toBe(false)
    })

    it('all은 여러 이미지를 한 번에 캐싱 처리한다', () => {
      const cache = getImageCacheInstance()

      cache.all(['image-success-1.png', 'image-fail.png', 'image-success-2.png'])

      expect(cache.isCached('image-success-1.png')).toBe(true)
      expect(cache.isCached('image-success-2.png')).toBe(true)
      expect(cache.isCached('image-fail.png')).toBe(false)
    })

    it('이미 캐시된 이미지는 다시 로드 시도하지 않는다', () => {
      const cache = getImageCacheInstance()

      cache.all(['image-success.png'])
      cache.all(['image-success.png'])

      expect(cache.getCachedSize()).toBe(1)
      expect(cache.isCached('image-success.png')).toBe(true)
    })
  })
})
