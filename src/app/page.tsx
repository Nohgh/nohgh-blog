import Container from '@/app/_components/container'
import { Intro } from '@/app/_components/intro'
import { getAllPosts } from '@/lib/post-api'
import { Posts } from './_components/posts'

export default function Index() {
  const allPosts = getAllPosts()

  return (
    <main>
      <Container>
        <Intro />
        <Posts posts={allPosts} />
      </Container>
    </main>
  )
}
