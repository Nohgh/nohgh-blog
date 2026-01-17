import { Posts } from './posts/(components)/posts'
import Container from '@/app/layout/container'
import { Intro } from '@/app/layout/intro'
import { getAllPosts } from '@/app/posts/utils'

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
