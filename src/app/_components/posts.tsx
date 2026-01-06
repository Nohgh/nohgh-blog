import type { Post } from '@/interfaces/post'
import { PostPreview } from './post-preview'
import { getPostsByYear } from '@/lib/post-api'

type Props = {
  posts: Post[]
}

export function Posts({ posts }: Props) {
  const postsByYear = getPostsByYear(posts)

  return (
    <section className="font-gowun mb-32">
      {postsByYear.map(([year, posts]) => (
        <div key={year} className="mb-16 pb-5 border-b dark:border-neutral-800 ">
          <h1 className="mb-8 text-xl md:text-2xl tracking-tighter leading-tight font-bold dark:text-neutral-500 text-neutral-600 cursor-default">
            {year}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-x-16 lg:gap-x-32 gap-y-11 md:gap-y-10 xl:gap-y-14">
            {posts.map((post) => (
              <PostPreview key={post.slug} title={post.title} date={post.date} slug={post.slug} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
