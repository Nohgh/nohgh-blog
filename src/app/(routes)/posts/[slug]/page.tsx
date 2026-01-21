import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostBody } from '../../../../domain/posts/components/post-body'
import PostFooter from '../../../../domain/posts/components/post-footer'
import { PostHeader } from '../../../../domain/posts/components/post-header'
import PostIsland from '../../../../domain/posts/components/post-toc'
import { getAllPosts, getPostBySlug } from '../../../../domain/posts/utils'
import Container from '@app/layout/container'
import { HOME_OG_IMAGE_URL } from '@app/lib/constants'
import markdownToHtml from '@app/lib/markdownToHtml'

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
