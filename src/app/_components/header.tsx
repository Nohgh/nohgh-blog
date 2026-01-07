'use client'

import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'
import { PROFILE_IMAGE_URL } from '@/lib/constants'
import { cacheImages } from '@/lib/cache-images'
import { useCallback } from 'react'

const prefetchImagesQueue = [PROFILE_IMAGE_URL]

const Header = () => {
  const handleOnMouseOver = useCallback(() => {
    cacheImages(prefetchImagesQueue)
  }, [])

  return (
    <header
      onMouseOver={handleOnMouseOver}
      className="font-gowun sticky top-0 py-2 pr-12 z-40 h-[40px] w-full flex flex-row justify-end gap-6 text-base 2xl:text-lg backdrop-blur-sm md:backdrop-blur-0"
    >
      <Link href="/" className="hover:underline" prefetch={true}>
        홈
      </Link>
      <Link href="/about" className="hover:underline" prefetch={true}>
        about
      </Link>
      <ThemeSwitcher />
    </header>
  )
}

export default Header
