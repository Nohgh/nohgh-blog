import matter from 'gray-matter'
import { fs, vol } from 'memfs'
import { Post } from '@domain/posts/schema'
import { getFileContents, getPostImages, getPostsByYear, parseMarkdown } from '@domain/posts/utils'

vi.mock('node:fs')
vi.mock('node:fs/promises')
vi.mock('gray-matter', () => ({
  default: vi.fn(),
}))

describe('posts utils', () => {
  beforeEach(() => {
    vol.reset()
    vi.resetModules()
    vi.clearAllMocks()
  })

  describe('getFileContents', () => {
    it('path에 대해 파일을 읽고 해당 파일의 문자열을 반환한다.', () => {
      const path = '/hello-world.txt'
      fs.writeFileSync(path, 'hello world')

      const text = getFileContents(path)
      expect(text).toBe('hello world')
    })

    it('여러 파일을 읽을 수 있다', () => {
      // fromJSON으로 여러 파일을 정의한다.
      vol.fromJSON(
        {
          './dir1/hw.txt': 'hello dir1',
          './dir2/hw.txt': 'hello dir2',
        },
        // default cwd
        '/tmp',
      )

      expect(getFileContents('/tmp/dir1/hw.txt')).toBe('hello dir1')
      expect(getFileContents('/tmp/dir2/hw.txt')).toBe('hello dir2')
    })
  })

  describe('parseMarkdown', () => {
    it('fileContents를 matter에 넘기고 결과를 그대로 반환한다', () => {
      // 테스트용 목데이터 생성
      const mocked = { data: { title: 'T' }, content: 'BODY' }

      // matter 함수를 모의 함수로 대체하고 반환값을 위의 목데이터로 설정
      ;(matter as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mocked)

      // 테스트용 마크다운 형식의 입력값
      const input = '---\ntitle: T\n---\nBODY'

      // Act: 테스트 대상 함수 실행
      const result = parseMarkdown(input)

      expect(matter).toHaveBeenCalledWith(input)
      expect(result).toBe(mocked)
    })

    it('matter가 에러를 던지면 그대로 전파한다', () => {
      ;(matter as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('parse error')
      })

      expect(() => parseMarkdown('bad')).toThrow('parse error')
    })
  })

  describe('getPostsByYear', () => {
    it('포스트들을 연도별로 그룹화하여 반환한다', () => {
      const posts: Post[] = [
        { slug: '1', date: '2024-01-01', title: 'Post 1', content: '' },
        { slug: '2', date: '2024-02-01', title: 'Post 2', content: '' },
        { slug: '3', date: '2023-01-01', title: 'Post 3', content: '' },
      ]
      const result = getPostsByYear(posts)

      expect(result).toHaveLength(2)
      expect(result[0][0]).toBe('2024')
      expect(result[0][1]).toHaveLength(2)
      expect(result[1][0]).toBe('2023')
      expect(result[1][1]).toHaveLength(1)
    })
  })

  describe('getPostImages', () => {
    it('커버 이미지와 이미지 목록을 합쳐 반환한다', () => {
      const post: Post = {
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        coverImage: '/cover.jpg',
        images: ['/image1.jpg', '/image2.jpg'],
        content: '',
      }
      const images = getPostImages(post)
      expect(images).toEqual(['/cover.jpg', '/image1.jpg', '/image2.jpg'])
    })
    it('커버 이미지가 없을 경우 이미지 목록만 반환한다', () => {
      const post: Post = {
        slug: 'test',
        title: 'Test',
        date: '2024-01-01',
        images: ['/image1.jpg'],
        content: '',
      }
      const images = getPostImages(post)
      expect(images).toEqual(['/image1.jpg'])
    })
  })
})
