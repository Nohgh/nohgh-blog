'use client'

import Link from 'next/link'
import DateFormatter from './date-formatter'

type Props = {
  title: string
  date: string
  slug: string
  images?: string[]
}

const prefetchedImages = new Set<string>()

function prefetchImage(src: string) {
  if (prefetchedImages.has(src)) return

  prefetchedImages.add(src)

  const img = new Image()
  img.src = src
}

function onMouseEnterHandler(images: string[] | undefined) {
  if (!images) return

  return images.forEach(prefetchImage)
}

export function PostPreview({ title, date, slug, images }: Props) {
  return (
    <div
      className="md:flex md:items-baseline md:justify-between"
      onMouseEnter={() => onMouseEnterHandler(images)}
    >
      <h3 className="md:text-2xl text-xl leading-snug">
        <Link href={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="md:text-lg text-base cursor-default">
        <DateFormatter dateString={date} />
      </div>
    </div>
  )
}
