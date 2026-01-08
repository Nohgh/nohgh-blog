import { Posts } from './_components/posts'
import Container from '@/app/_components/container'
import { Intro } from '@/app/_components/intro'
import { getAllPosts } from '@/lib/post-api'

export default function Index() {
  const posts = getAllPosts()

  return (
    <main>
      <Container>
        <Intro />
        <Posts posts={posts} />
      </Container>
    </main>
  )
}
