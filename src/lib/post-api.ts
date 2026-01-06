import fs from 'fs'
import matter from 'gray-matter'
import { join } from 'path'
import type { Post } from '@/interfaces/post'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  return { ...data, slug: realSlug, content } as Post
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export function getRelativePosts(slug: string) {
  const allPosts = getAllPosts() // date desc
  const index = allPosts.findIndex((p) => p.slug === slug)

  if (index === -1) return { newer: null, older: null }

  const newer = allPosts[index - 1] ?? null
  const older = allPosts[index + 1] ?? null

  return { newer, older }
}

type PostsByYear = [string, Post[]][]

export function getPostsByYear(posts: Post[]): PostsByYear {
  const yearMap = new Map<string, Post[]>()

  for (const post of posts) {
    const year = post.date.split(' ')[0].split('-')[0]
    const c = yearMap.get(year)
    if (c) {
      c.push(post)
    } else {
      yearMap.set(year, [post])
    }
  }

  return Array.from(yearMap.entries())
}
