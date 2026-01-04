---
title: '인턴을 준비하며'
excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.'
coverImage: '/assets/blog/preview/cover.jpg'
date: '2025-01-02'
author:
  name: Joe Haddad
  picture: '/assets/blog/authors/joe.jpeg'
ogImage:
  url: '/assets/blog/preview/cover.jpg'
---

---

```tsx
import { Post } from '@/interfaces/post'
import fs from 'fs'
import matter from 'gray-matter'
import { join } from 'path'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return { ...data, slug: realSlug, content } as Post
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
```

1. `동해물과 백두산이` 마르고 닳도록
   하느님이 보우하사 우리나라 만세
   무궁화 삼천리 화려 강산
   대한 사람 대한으로 길이 보전하세
2. 남산 위에 저 소나무 철갑을 두른 듯
   바람 서리 불변함은 우리 기상일세
   무궁화 삼천리 화려 강산
   대한 사람 대한으로 길이 보전하세
3. 가을 하늘 공활한데 높고 구름 없이
   밝은 달은 우리 가슴 일편단심일세
   무궁화 삼천리 화려 강산
   대한 사람 대한으로 길이 보전하세
4. 이 기상과 이 맘으로 충성을 다하여
   괴로우나 즐거우나 나라 사랑하세
   무궁화 삼천리 화려 강산
   대한 사람 대한으로 길이 보전하세

---

`Lorem` ipsum dolor sit `amet`, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum [구글로 이동합니다.](https://google.com) facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

```ts
function sum(a, b) {
  return a + b
}
```

```go {2,3,4}
import "fmt"

func main(){
  fmt.Println("hello world")
}

```

### 안녕하세요. 이번 포스트에서는 이런이런이런이런이런 내용을 다루겠습니다.!!!!!!!!!!!!

Venenatis cras sed felis eget velit. Consectetur libero id faucibus nisl tincidunt. Gravida in fermentum et sollicitudin ac orci phasellus egestas tellus. Volutpat consequat mauris nunc congue nisi vitae. Id aliquet risus feugiat in ante metus dictum at tempor. Sed blandit libero volutpat sed cras. Sed odio morbi quis commodo odio aenean sed adipiscing. Velit euismod in pellentesque massa placerat. Mi bibendum neque egestas congue quisque egestas diam in arcu. Nisi lacus sed viverra tellus in. Nibh cras pulvinar mattis nunc sed. Luctus accumsan tortor posuere ac ut consequat semper viverra. Fringilla ut morbi tincidunt augue interdum velit euismod.

## Lorem Ipsum

Tristique senectus et netus et malesuada fames ac turpis. Ridiculous mus mauris vitae ultricies leo integer malesuada nunc vel. In mollis nunc sed id semper. Egestas tellus rutrum tellus pellentesque. Phasellus vestibulum lorem sed risus ultricies tristique nulla. Quis blandit turpis cursus in hac habitasse platea dictumst quisque. Eros donec ac odio tempor orci dapibus ultrices. Aliquam sem et tortor consequat id porta nibh. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla. Diam vulputate ut pharetra sit amet. Ut tellus elementum sagittis vitae et leo. Arcu non odio euismod lacinia at quis risus sed vulputate.

---

1. 순서가 있는 항목
1. 순서가 있는 항목
   1. 순서가 없는 항목
   1. 순서가 없는 항목
1. 순서가 있는 항목
1. 순서가 있는 항목

- 순서가 없는 항목
- 순서가 없는 항목
  - 순서가 없는 항목
  - 순서가 없는 항목
    - 1
      - 2
        - 3ㄴㄴㄴㄴ
          - 4

[GOOGLE](https://google.com)

[NAVER](https://naver.com '링크 설명(title)을 작성하세요.')

[상대적 참조](../users/login)

![대체 텍스트(Alternative Text)](https://picsum.photos/1000/400 '링크 설명(Title)')

![이미지입니다!][Image]

[Image]: https://picsum.photos/500/300 '이미지입니다!'

---

| 값         |                  의미                  |   기본값 |
| ---------- | :------------------------------------: | -------: |
| static     |     유형(기준) 없음 / 배치 불가능      | `static` |
| `relative` |       요소 자신을 기준으로 배치        |          |
| absolute   | 위치 상 부모(조상)요소를 기준으로 배치 |          |
| fixed      |      브라우저 창을 기준으로 배치       |          |
| `sticky`   |       스크롤 영역 기준으로 배치        |          |
