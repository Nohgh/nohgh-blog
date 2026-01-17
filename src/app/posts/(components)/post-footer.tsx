import { PostRelative } from './post-relative'
import { getPostImages, getRelativePosts } from '@/app/posts/utils'

export default function PostFooter({ slug }: { slug: string }) {
  const { newer, older } = getRelativePosts(slug)

  let images = new Map<string, string[]>()

  if (newer) {
    images.set('newer', getPostImages(newer))
  }
  if (older) {
    images.set('older', getPostImages(older))
  }

  return (
    <footer className="mt-2 border-t-[2px] border-neutral-200 dark:border-neutral-800">
      <nav className="mt-6 flex justify-between gap-4">
        <div>
          {newer && <PostRelative post={newer} images={images.get('newer')} type={'newer'} />}
        </div>
        <div className="text-right">
          {older && <PostRelative post={older} images={images.get('older')} type={'older'} />}
        </div>
      </nav>
    </footer>
  )
}
