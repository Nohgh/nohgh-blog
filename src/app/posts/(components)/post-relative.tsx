'use client'

import Link from 'next/link'
import type { Post } from '@/app/posts/(schema)/post'
import { cacheImages } from '@/app/lib/cache-images'

type RelativeType = 'newer' | 'older'

interface Props {
  post: Post
  images?: string[]
  type: RelativeType
}
export function PostRelative({ post, images, type }: Props) {
  return (
    <div
      className="text-neutral-600 dark:text-neutral-500"
      onMouseEnter={() => cacheImages(images)}
    >
      <div className="text-sm mb-2 cursor-default">{type === 'newer' ? '다음 글' : '이전 글'}</div>
      <Link
        href={`/posts/${post.slug}`}
        prefetch={true}
        className="hover:underline hover:underline-offset-4 hover:font-bold transition-all "
      >
        {type === 'newer' ? `← ${post.title}` : `${post.title} →`}
      </Link>
    </div>
  )
}
