import { Posts } from './posts/(components)/posts'
import Container from '@/layout/container'
import { Intro } from '@/layout/intro'
import { getAllPosts } from '@/posts/utils'

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
