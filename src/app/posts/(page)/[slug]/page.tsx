import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/layout/container'
import { HOME_OG_IMAGE_URL } from '@/lib/constants'
import markdownToHtml from '@/lib/markdownToHtml'
import { PostBody } from '@/posts/(components)/post-body'
import PostFooter from '@/posts/(components)/post-footer'
import { PostHeader } from '@/posts/(components)/post-header'
import PostIsland from '@/posts/(components)/post-toc'
import { getAllPosts, getPostBySlug } from '@/posts/utils'

export default async function Post(props: Params) {
  const params = await props.params
  const post = getPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  const { content, toc } = await markdownToHtml(post.content)

  return (
    <main>
      <Container>
        <article className="mb-32">
          <PostHeader title={post.title} coverImage={post.coverImage} date={post.date} />
          <PostIsland toc={toc} />
          <PostBody content={content} />
          <PostFooter slug={post.slug} />
        </article>
      </Container>
    </main>
  )
}

type Params = {
  params: { slug: string }
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const post = getPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  const title = `${post.title}`

  return {
    title,
    openGraph: {
      title,
      images: [post?.ogImage?.url || HOME_OG_IMAGE_URL],
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
