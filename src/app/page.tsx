import { getAllPosts } from '../domain'
import { Posts } from '../domain/posts/components/posts'
import Container from './layout/container'
import { Intro } from './layout/intro'

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
