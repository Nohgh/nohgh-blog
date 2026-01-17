import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import type { Post } from '../schema'
import { PostSchema } from '../schema/post-schema'

const POST_DIR_NAME = '__posts__'
export const POSTS_DIR_PATH = join(process.cwd(), POST_DIR_NAME)

const DATE_SLUG_REGEX = /^\d{6}-/
function filterValidSlug(slug: string) {
  return DATE_SLUG_REGEX.test(slug)
}

function getPostSlugs() {
  return fs.readdirSync(POSTS_DIR_PATH).filter(filterValidSlug)
}

function getSlugWithoutExtension(slug: string) {
  return slug.replace(/\.md$/, '')
}

function getPostFilePath(slug: string) {
  return join(POSTS_DIR_PATH, `${slug}.md`)
}

function validatePost(input: unknown): Post {
  const parsedPostResult = PostSchema.safeParse(input)

  if (!parsedPostResult.success) {
    throw new Error(
      parsedPostResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n'),
    )
  }

  return parsedPostResult.data
}

function getPostTimestamp(post: Post) {
  return new Date(post.date).getTime()
}

function comparePostByDateDesc(a: Post, b: Post) {
  return getPostTimestamp(b) - getPostTimestamp(a)
}

export function getFileContents(path: string) {
  return fs.readFileSync(path, 'utf-8')
}

export function parseMarkdown(fileContents: string) {
  return matter(fileContents)
}

export function getPostBySlug(slug: string): Post {
  const _slug = getSlugWithoutExtension(slug)

  const postFilePath = getPostFilePath(_slug)

  const fileContents = getFileContents(postFilePath)

  const { data: frontMatter, content } = parseMarkdown(fileContents)

  const post = validatePost({
    ...frontMatter,
    slug: _slug,
    content,
  })

  return post
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs.map((slug) => getPostBySlug(slug)).sort(comparePostByDateDesc)

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

// YYMMDD- 또는 private- 로 시작하지 않는 파일
const EXCLUDE_INVALID_SLUG_PATTERN = /^(?:\d{6}-|private-)/

function filterInvalidPosts(slug: string) {
  return !EXCLUDE_INVALID_SLUG_PATTERN.test(slug)
}

function isMarkdownFile(name: string) {
  return name.endsWith('.md')
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg']
function isImageFile(name: string) {
  return IMAGE_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext))
}

export async function getInvalidPosts(): Promise<string[]> {
  return fs.readdirSync(POSTS_DIR_PATH).filter(isMarkdownFile).filter(filterInvalidPosts)
}

export async function getImageFiles(): Promise<string[]> {
  return fs.readdirSync(POSTS_DIR_PATH).filter(isImageFile)
}

export type IncompletedPost = Partial<Post>
export async function getInvalidPostBySlug(slug: string): Promise<IncompletedPost> {
  const _slug = getSlugWithoutExtension(slug)

  const postFilePath = getPostFilePath(_slug)

  const fileContents = getFileContents(postFilePath)

  const { data: frontMatter, content } = parseMarkdown(fileContents)

  const post = {
    ...frontMatter,
    slug: _slug,
    content,
  }

  return post
}
