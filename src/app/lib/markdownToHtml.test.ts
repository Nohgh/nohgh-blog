import { describe, it, expect } from 'vitest'
import markdownToHtml from './markdownToHtml'

describe('markdownToHtml', () => {
  describe('기본 기능', () => {
    it('빈 문자열이 입력되면 빈 문자열과 빈 TOC를 반환한다', async () => {
      const { content, toc } = await markdownToHtml('')
      expect(content).toBe('')
      expect(toc).toEqual([])
    })

    it('테이블이 렌더링된다', async () => {
      const md = `| a | b |\n|---|---|\n| 1 | 2 |`
      const { content } = await markdownToHtml(md)
      expect(content).toContain('<table>')
      expect(content).toContain('<th>')
      expect(content).toContain('<td>')
    })
  })

  describe('TOC (목차) 생성', () => {
    it('h1 ~ h6의 level이 정확히 들어간다', async () => {
      const md = `# a\n## b\n### c\n#### d\n##### e\n###### f`
      const { toc } = await markdownToHtml(md)
      expect(toc.map((t) => t.level)).toEqual([1, 2, 3, 4, 5, 6])
    })

    it('중복된 제목은 고유한 ID를 가진다', async () => {
      const md = `# Hello\n# Hello\n# Hello`
      const { toc } = await markdownToHtml(md)
      const ids = toc.map((item) => item.id)
      expect(new Set(ids).size).toBe(3)
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

    it('텍스트가 비어있는 헤딩은 TOC에 포함하지 않는다', async () => {
      const md = `# \n## \n###`
      const { toc } = await markdownToHtml(md)
      expect(toc).toEqual([])
    })

    it('헤딩 text는 toString 기준으로 들어간다(인라인 요소 포함)', async () => {
      const md = `## Hello \`code\` [link](https://a.com)`
      const { toc } = await markdownToHtml(md)
      expect(toc[0].level).toBe(2)
      expect(toc[0].text).toBe('Hello code link')
      expect(toc[0].id).toBeTruthy()
    })
  })

  describe('이미지 최적화', () => {
    it('이미지에 loading/decoding을 기본값으로 추가한다', async () => {
      const md = `![alt](/a.png)`
      const { content } = await markdownToHtml(md)
      expect(content).toContain('<img')
      expect(content).toContain('src="/a.png"')
      expect(content).toContain('loading="lazy"')
      expect(content).toContain('decoding="async"')
    })

    it('이미지에 이미 loading/decoding이 있으면 덮어쓰지 않는다', async () => {
      const md = `![alt](/a.png){loading="eager" decoding="sync"}`
      const { content } = await markdownToHtml(md)
      expect(content).toContain('loading="eager"')
      expect(content).toContain('decoding="sync"')
    })
  })

  describe('링크 처리', () => {
    it('외부 링크에 target/rel이 적용된다', async () => {
      const md = `[google](https://google.com)`
      const { content } = await markdownToHtml(md)
      expect(content).toContain('href="https://google.com"')
      expect(content).toContain('target="_blank"')
      expect(content).toContain('rel="noopener noreferrer"')
    })

    it('내부 링크에는 target/rel이 적용되지 않는다', async () => {
      const md = `[internal](/posts/1)`
      const { content } = await markdownToHtml(md)
      expect(content).not.toContain('target="_blank"')
      expect(content).not.toContain('rel=')
    })
  })

  describe('보안 및 XSS 방지', () => {
    it('인라인 코드가 code 블록으로 생성된다', async () => {
      const md = '`<script>alert(1)</script>`'
      const { content } = await markdownToHtml(md)
      expect(content).toContain('<code>')
      expect(content).not.toContain('<script>')
    })

    it('XSS 공격이 이스케이프 처리된다', async () => {
      const md = `<script>alert('xss')</script>`
      const { content } = await markdownToHtml(md)
      expect(content).not.toContain('<script>')
      expect(content).toContain('') // 이 테스트는 수정 필요
    })

    it('img 태그의 XSS 공격이 방지된다', async () => {
      const md = `<img src="x" onerror="alert(1)">`
      const { content } = await markdownToHtml(md)
      expect(content).not.toContain('onerror')
    })

    it('다양한 이벤트 핸들러가 제거된다', async () => {
      const md = `<div onclick="alert(1)" onload="alert(2)" onmouseover="alert(3)">content</div>`
      const { content } = await markdownToHtml(md)
      expect(content).not.toContain('onclick')
      expect(content).not.toContain('onload')
      expect(content).not.toContain('onmouseover')
    })

    it('script 태그가 완전히 제거된다', async () => {
      const md = `<script>alert('xss')</script><script src="evil.js"></script>`
      const { content } = await markdownToHtml(md)
      expect(content).not.toContain('<script>')
      expect(content).toBe('')
    })

    it('javascript: 프로토콜이 제거된다', async () => {
      const md = `<a href="javascript:alert(1)">click me</a>`
      const { content } = await markdownToHtml(md)
      expect(content).not.toContain('javascript:')
    })

    it('iframe 태그가 제거된다', async () => {
      const md = `<iframe src="javascript:alert(1)"></iframe>`
      const { content } = await markdownToHtml(md)
      expect(content).not.toContain('<iframe>')
    })
  })

  describe('성능', () => {
    // 테스트 데이터 크기: 190.4KB, 평균 처리 시간: 810ms ~ 870ms
    it('대용량 마크다운 처리 시간이 1초 이내이다', async () => {
      const largeMd = `
# 제목
## 소제목
텍스트 내용 \`코드\` **볼드** *이탤릭*
| 컬럼1 | 컬럼2 |
|-------|-------|
| 데이터1 | 데이터2 |
![이미지](/image.png)
[링크](https://example.com)
\`\`\`javascript
const code = 'example';
\`\`\`
- 리스트 아이템1
- 리스트 아이템2
`.repeat(1000)

      console.log(`테스트 데이터 크기: ${(largeMd.length / 1024).toFixed(1)}KB`)
      const start = performance.now()
      await markdownToHtml(largeMd)
      const end = performance.now()
      console.log(`처리 시간: ${(end - start).toFixed(2)}ms`)
      expect(end - start).toBeLessThan(1000)
    })
  })
})
