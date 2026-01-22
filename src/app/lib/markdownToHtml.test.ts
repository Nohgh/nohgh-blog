import { describe, it, expect } from 'vitest'
import markdownToHtml from './markdownToHtml'

describe('markdownToHtml', () => {
  it('h1~h6의 level이 정확히 들어간다', async () => {
    const md = `# a\n## b\n### c\n#### d\n##### e\n###### f`
    const { toc } = await markdownToHtml(md)

    expect(toc.map((t) => t.level)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('텍스트가 비어있는 헤딩은 TOC에 포함하지 않는다', async () => {
    const md = `# \n## \n###`
    const { toc } = await markdownToHtml(md)
    expect(toc).toEqual([])
  })

  it('헤딩으로 TOC를 생성하고, heading id와 일치한다', async () => {
    const md = `
# Hello World
## Second Title
### Third

text
`.trim()

    const { content, toc } = await markdownToHtml(md)

    expect(toc).toEqual([
      { id: 'hello-world', text: 'Hello World', level: 1 },
      { id: 'second-title', text: 'Second Title', level: 2 },
      { id: 'third', text: 'Third', level: 3 },
    ])

    expect(content).toContain('<h1 id="hello-world">')
    expect(content).toContain('<h2 id="second-title">')
    expect(content).toContain('<h3 id="third">')
  })

  it('img에 loading/decoding을 기본값으로 추가한다', async () => {
    const md = `![alt](/a.png)`
    const { content } = await markdownToHtml(md)

    expect(content).toContain('<img')
    expect(content).toContain('src="/a.png"')
    expect(content).toContain('loading="lazy"')
    expect(content).toContain('decoding="async"')
  })

  it('외부 링크에 target/rel이 적용된다', async () => {
    const md = `[google](https://google.com)`
    const { content } = await markdownToHtml(md)

    expect(content).toContain('href="https://google.com"')
    expect(content).toContain('target="_blank"')
    expect(content).toContain('rel="noopener noreferrer"')
  })

  it('헤딩 text는 toString 기준으로 들어간다(인라인 요소 포함)', async () => {
    const md = `## Hello \`code\` [link](https://a.com)`
    const { toc } = await markdownToHtml(md)

    expect(toc[0].level).toBe(2)
    expect(toc[0].text).toBe('Hello code link')
    expect(toc[0].id).toBeTruthy()
  })

  it('빈 문자열이 입력되면 빈 문자열과 빈 TOC를 반환한다', async () => {
    const { content, toc } = await markdownToHtml('')

    expect(content).toBe('')
    expect(toc).toEqual([])
  })

  it('중복된 제목은 고유한 ID를 가진다', async () => {
    const md = `# Hello\n# Hello\n# Hello`
    const { toc } = await markdownToHtml(md)

    const ids = toc.map((item) => item.id)

    expect(new Set(ids).size).toBe(3)
  })
})
