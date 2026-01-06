import { type Author } from './author'

export type Post = {
  slug: string
  title: string
  date: string
  content: string
  coverImage?: string
  images?: string[]
  ogImage?: {
    url: string
  }
  preview?: boolean
}
