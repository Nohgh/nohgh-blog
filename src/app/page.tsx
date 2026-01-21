import Container from './layout/container'
import { Intro } from './layout/intro'
import { getAllPosts } from '@domain/posts'
import { Posts } from '@domain/posts/components/posts'

export default async function Index() {
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
