import { getRelativePosts } from '@/lib/post-api'
import Link from 'next/link'

export default function PostFooter({ slug }: { slug: string }) {
  const { newer, older } = getRelativePosts(slug)

  return (
    <footer className="mt-2 border-t-[2px] border-neutral-200 dark:border-neutral-800">
      <nav className="mt-6 flex justify-between gap-4">
        <div>
          {newer && (
            <div className="text-neutral-600 dark:text-neutral-500">
              <div className="text-sm mb-2 cursor-default">다음 글</div>
              <Link
                href={`/posts/${newer.slug}`}
                className="hover:underline hover:underline-offset-4 hover:font-bold transition-all "
              >
                ← {newer.title}
              </Link>
            </div>
          )}
        </div>
        <div className="text-right">
          {older && (
            <div className="text-neutral-600 dark:text-neutral-500">
              <div className="text-sm mb-2 cursor-default">이전 글</div>
              <Link
                href={`/posts/${older.slug}`}
                className="hover:underline hover:underline-offset-4 hover:font-bold transition-all "
              >
                {older.title} →
              </Link>
            </div>
          )}
        </div>
      </nav>
    </footer>
  )
}
