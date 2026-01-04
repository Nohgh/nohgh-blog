import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'

export type TocLink = {
  id: string
  text: string
  level: number
}

function optimizeImages(node: any, tag: any) {
  if (tag === 'img') {
    const props = (node.properties ??= {})
    if (props.loading == null) props.loading = 'lazy'
    if (props.decoding == null) props.decoding = 'async'
    return
  }
}

function generateTOC(tag: any, node: any, toc: TocLink[]) {
  if (!/^h[1-6]$/.test(tag)) return

  const id = node.properties?.id
  if (typeof id !== 'string' || !id) return

  const text = toString(node).trim()
  if (!text) return

  toc.push({
    id,
    text,
    level: Number(tag[1]),
  })
}

async function rehypeVisitPipes(toc: TocLink[]) {
  return () => (tree: any) => {
    visit(tree, 'element', (node: any) => {
      const tag = node.tagName

      if (!tag) return

      optimizeImages(node, tag)

      generateTOC(tag, node, toc)
    })
  }
}

const baseProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypePrettyCode, {
    theme: 'github-dark',
    keepBackground: true,
  })
  .use(rehypeExternalLinks, {
    target: '_blank',
    rel: ['noopener', 'noreferrer'],
  })
  .use(rehypeStringify)

export default async function markdownToHtml(markdown: string) {
  const toc: TocLink[] = []

  const processor = baseProcessor

  const file = await processor()
    .use(await rehypeVisitPipes(toc))
    .process(markdown)

  return {
    content: String(file),
    toc,
  }
}
