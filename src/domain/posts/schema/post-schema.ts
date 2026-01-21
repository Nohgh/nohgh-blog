import { z } from 'zod'
import { isValidDate } from '@app/lib/date'

const SchemaErrorMessages = {
  'base-date-invalid': '유효하지 않은 날짜입니다',
  'detail-date-invalid': '유효하지 않은 날짜/시간입니다',
}

const PostBasicDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(isValidDate, { message: SchemaErrorMessages['base-date-invalid'] })

const PostDetailDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  .refine(isValidDate, { message: SchemaErrorMessages['detail-date-invalid'] })

const PostDateSchema = z.union([PostBasicDateSchema, PostDetailDateSchema])

const PostTagSchema = z.union([z.string(), z.array(z.string())])

const PostSchema = z.object({
  // frontmatter
  title: z.string(),
  coverImage: z.string().optional(),
  date: PostDateSchema,
  slug: z.string(),
  ogImage: z.object({ url: z.string() }).optional(),
  images: z.array(z.string()).optional(),

  // content
  content: z.string(),

  // etc
  tags: PostTagSchema.optional(),
})

export { PostBasicDateSchema, PostDetailDateSchema, PostDateSchema, PostTagSchema, PostSchema }
