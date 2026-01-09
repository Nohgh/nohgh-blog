import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import type { Post } from '@/interfaces/post'
import { PostSchema } from '@/interfaces/post-schema'

// ----- constants ----- //

const FILTER_SLUG_PREFIX = 'private'
const POST_DIR_NAME = '__posts__'
const POSTS_DIR_PATH = join(process.cwd(), POST_DIR_NAME)

// ----- private functions ----- //

function _filterSlug(slug: string) {
  return !slug.startsWith(FILTER_SLUG_PREFIX)
}

function _getPostSlugs() {
  return fs.readdirSync(POSTS_DIR_PATH).filter(_filterSlug)
}

function _getSlugWithoutExtension(slug: string) {
  return slug.replace(/\.md$/, '')
}

function _getPostFilePath(slug: string) {
  return join(POSTS_DIR_PATH, `${slug}.md`)
}

function _readPostFile(path: string) {
  return fs.readFileSync(path, 'utf-8')
}

function _parseMarkdown(fileContents: string) {
  return matter(fileContents)
}

function _validatePost(input: unknown): Post {
  const parsedPostResult = PostSchema.safeParse(input)

  if (!parsedPostResult.success) {
    throw new Error(
      parsedPostResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n'),
    )
  }

  return parsedPostResult.data
}

function _getPostTimestamp(post: Post) {
  return new Date(post.date).getTime()
}

function _comparePostByDateDesc(a: Post, b: Post) {
  return _getPostTimestamp(b) - _getPostTimestamp(a)
}

// ----- public functions ----- //

export function getPostBySlug(slug: string): Post {
  const _slug = _getSlugWithoutExtension(slug)

  const postFilePath = _getPostFilePath(_slug)

  const fileContents = _readPostFile(postFilePath)

  const { data: frontMatter, content } = _parseMarkdown(fileContents)

  const post = _validatePost({
    ...frontMatter,
    slug: _slug,
    content,
  })

  return post
}

let cachedPosts: Post[] | undefined
export function getAllPosts(): Post[] {
  if (cachedPosts) {
    return cachedPosts
  }

  const slugs = _getPostSlugs()
  const posts = slugs.map((slug) => getPostBySlug(slug)).sort(_comparePostByDateDesc)

  cachedPosts = posts

  return posts
}

export function getRelativePosts(slug: string) {
  const allPosts = getAllPosts()
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

export function getPostImages(post: Post) {
  return [...(post.coverImage ? [post.coverImage] : []), ...(post.images ?? [])]
}
