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

    const testInstance = ImageCache.getInstance()

    testInstance.clear()

    setImageCacheTestInstance(testInstance)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('getImageCacheInstance는 동일 인스턴스를 반환한다', () => {
    const a = getImageCacheInstance()
    const b = getImageCacheInstance()

    expect(a).toBe(b)
  })

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
})
