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

function rehypeCollectToc(toc: TocLink[]) {
  return () => (tree: any) => {
    visit(tree, 'element', (node: any) => {
      const tagName = node.tagName
      if (typeof tagName !== 'string' || !/^h[1-6]$/.test(tagName)) return

      const id = node.properties?.id
      if (typeof id !== 'string' || !id) return

      const text = toString(node).trim()
      if (!text) return

      toc.push({
        id,
        text,
        level: Number(tagName[1]),
      })
    })
  }
}

export default async function markdownToHtml(markdown: string) {
  const toc: TocLink[] = []

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeCollectToc(toc))
    .use(rehypePrettyCode, {
      theme: 'github-dark',
      keepBackground: true,
    })
    .use(rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    })
    .use(rehypeStringify)
    .process(markdown)

  return { content: String(file), toc }
}
