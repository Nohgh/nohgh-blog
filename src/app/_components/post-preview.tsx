'use client'
import Link from 'next/link'
import DateFormatter from './date-formatter'
import { prefetchPostImages } from '@/lib/prefetch-post-images'

type Props = {
  title: string
  date: string
  slug: string
  images?: string[]
}

export function PostPreview({ title, date, slug, images }: Props) {
  return (
    <div
      className="md:flex md:items-baseline md:justify-between"
      onMouseEnter={() => prefetchPostImages(images)}
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
