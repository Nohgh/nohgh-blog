import { z } from 'zod'
import {
  PostBasicDateSchema,
  PostDetailDateSchema,
  PostDateSchema,
  PostTagSchema,
  PostSchema,
} from './post-schema'

export type PostBasicDate = z.infer<typeof PostBasicDateSchema>
export type PostDetailDate = z.infer<typeof PostDetailDateSchema>
export type PostDate = z.infer<typeof PostDateSchema>

export type PostTag = z.infer<typeof PostTagSchema>

export type Post = z.infer<typeof PostSchema>
