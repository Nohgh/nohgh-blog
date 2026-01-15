import fs from 'fs'
import { rename } from 'fs/promises'
import path from 'path'
import { checkbox, input, select, Separator, confirm } from '@inquirer/prompts'
import {
  getInvalidPosts as getInvalidFiles,
  getInvalidPostBySlug,
  parseMarkdown,
  POSTS_DIR_PATH,
  readPostFile,
} from '@/lib/post-api'

// constants
const ActionTypeMap = {
  upload: 'upload',
  update: 'update',
  delete: 'delete',
} as const
type ActionType = keyof typeof ActionTypeMap

export async function askAction() {
  const actionType: ActionType = await select({
    message: 'Nohgh blog cli\n 무엇을 실행할까요. 아래 선택지에서 선택해주세요',
    choices: [
      {
        name: '업로드하기',
        value: ActionTypeMap.upload,
        description: '블로그를 새로 업로드합니다.',
      },
      {
        name: '수정하기',
        value: ActionTypeMap.update,
        description: '포스트를 수정합니다.',
      },
      {
        name: '삭제하기',
        value: ActionTypeMap.delete,
        description: '특정 포스트를 삭제합니다.',
      },
      new Separator(),
    ],
  })

  return actionType
}

export function handleAction(action: ActionType) {
  switch (action) {
    case ActionTypeMap.upload:
      uploadBlog()
      break
    case ActionTypeMap.update:
      console.log('수정하기')
      break
    case ActionTypeMap.delete:
      console.log('삭제하기')
      break
  }
}

export type FrontMatter = {
  [key: string]: any
}

async function uploadBlog() {
  const invalidFiles = await getInvalidFiles()

  const selectedFile = await selectFile(invalidFiles)

  const invalidPost = await getInvalidPostBySlug(selectedFile)

  const slug = invalidPost.slug

  if (!slug) throw Error('slug가 들어오지 않았습니다.')

  const renamedPostFile = await renamePostFile(slug)

  const fileContents = readPostFile(renamedPostFile)

  const { data: frontMatter, content: body } = parseMarkdown(fileContents)

  await clearFrontMatter(renamedPostFile, frontMatter, body)

  const images = extractImages(body)

  imagePipe(slug, body, images)
}

async function selectFile(invalidPosts: string[]) {
  const selectedSlug = await select({
    message: '아래는 유효하지 않은 파일들입니다. 하나를 선택해주세요.',
    choices: invalidPosts.map((slug) => ({
      name: slug,
      value: slug,
    })),
  })

  return selectedSlug
}

async function getInput(message: string) {
  return await input({ message })
}

function getMDFileFullPath(slug: string) {
  return POSTS_DIR_PATH + '/' + slug + '.md'
}

// YYMMDD 형식의 날짜
function getFormattedDate() {
  const today = new Date()

  const yy = String(today.getFullYear()).slice(-2)
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')

  const formatted = `${yy}${mm}${dd}`
  return formatted
}

// TODO: join사용하는 방식으로 변경
async function renamePostFile(oldSlug: string) {
  const newSlugMessage =
    '새로운 파일이름을 입력해주세요. \n오늘의 날짜(YYMMDD)뒤에 붙어 변경됩니다: '
  const newSlug = await getInput(newSlugMessage)

  const date = getFormattedDate()
  const MDSaperator = '-'
  const newFileName = date + MDSaperator + newSlug

  let [old, newer] = [getMDFileFullPath(oldSlug), getMDFileFullPath(newFileName)]

  await rename(old, newer)

  return newer
}

// front matter가 있으면 초기화
async function clearFrontMatter(path: string, frontMatter: FrontMatter, body: string) {
  if (Object.keys(frontMatter).length === 0) return

  fs.writeFileSync(path, body.trimStart(), 'utf-8')
}

// ![alt text](image-1.png)
type MarkdownImage = {
  raw: string // ![alt text](image-1.png)
  alt: string // alt text
  src: string // image-1.png
}
// 중복을 제거한 이미지를 반환
function extractImages(body: string): MarkdownImage[] {
  const images = new Map<string, MarkdownImage>()
  // ![alt text](image-1.png)
  const regex = /!\[([^\]]*)]\(([^)]+)\)/g

  let match: RegExpExecArray | null

  while ((match = regex.exec(body)) !== null) {
    const image = {
      raw: match[0],
      alt: match[1],
      src: match[2],
    }
    if (!images.has(image.src)) {
      images.set(image.src, image)
    }
  }

  return Array.from(images.values())
}

function toSafeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
}

async function imagePipe(slug: string, body: string, images: MarkdownImage[]) {
  if (images.length === 0) return body

  const indexesToEdit = await checkbox<number>({
    message: '편집할 이미지를 선택하세요',
    choices: images.map((img, index) => ({
      name: `${img.src} (alt: ${img.alt || '없음'})`,
      value: index,
    })),
  })

  let nextBody = body
  const toEditImages = indexesToEdit.map((i) => images[i])

  for (const image of toEditImages) {
    const nextAlt = await input({
      message: `${image.src}의 alt를 입력해주세요.`,
      default: image.alt,
    })

    const move = await confirm({
      message: `${image.src}를 /assets/blog/${slug}/ 아래로 이동하시겠습니까?`,
    })

    const ext = path.extname(image.src)
    const safeAlt = toSafeFileName(nextAlt)
    const nextSrc = `/assets/blog/${slug}/${getFormattedDate()}-${safeAlt}${ext}`

    if (move) {
      const from = path.join(process.cwd(), 'public', image.src)
      const to = path.join(process.cwd(), 'public', nextSrc)

      fs.mkdirSync(path.dirname(to), { recursive: true })
      await rename(from, to)
    }

    const replacedRaw = `![${nextAlt}](${nextSrc})`
    nextBody = nextBody.replaceAll(image.raw, replacedRaw)
  }

  return nextBody
}
