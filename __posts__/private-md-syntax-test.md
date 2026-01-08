---
title: 'Markdown 문법 테스트 (All-in-one)'
coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2026-01-08'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
---

# Markdown 문법 테스트

이 글은 렌더러/스타일링을 점검하기 위한 **마크다운 문법 종합 샘플**입니다.

---

## 1. 제목(Headings)

# H1

## H2

### H3

#### H4

##### H5

###### H6

---

## 2. 문단 / 줄바꿈

문단은 빈 줄로 구분됩니다.

같은 문단에서 강제 줄바꿈은 끝에 공백 두 칸을 넣습니다.  
이 줄은 바로 위 줄과 같은 문단입니다.

---

## 3. 강조(Emphasis)

- **굵게(Bold)**
- _기울임(Italic)_
- **_굵게+기울임(Bold+Italic)_**
- ~~취소선(Strikethrough)~~
- `인라인 코드(Inline code)`

---

## 4. 인용(Blockquote)

> 인용문 1단
>
> > 인용문 2단
>
> 인용문 안에서도 **강조**, `코드`, [링크](https://example.com) 가능합니다.

---

## 5. 목록(Lists)

### 5.1 순서 없는 목록(Unordered)

- 항목 A
- 항목 B
  - 중첩 B-1
  - 중첩 B-2
    - 더 중첩 B-2-a

### 5.2 순서 있는 목록(Ordered)

1. 첫 번째
2. 두 번째
   1. 두 번째-1
   2. 두 번째-2
3. 세 번째

### 5.3 체크박스(Task list)

- [x] 완료 항목
- [ ] 미완료 항목
- [ ] `코드` 포함 항목

---

## 6. 링크(Links)

- 일반 링크: https://example.com
- 마크다운 링크: [Example](https://example.com)
- 타이틀 포함: [Example](https://example.com 'example title')
- 참조 링크(Reference): [참조 링크][ref]

[ref]: https://example.com/reference

---

## 7. 이미지(Images)

> 실제 이미지는 `public`에 존재해야 정상 렌더링됩니다.

- 마크다운 이미지:

![OG Sample](/assets/blog/hello-world/cover.jpg)

---

## 8. 코드 블록(Fenced code blocks)

```ts
type User = {
  id: string
  name: string
}

export function greet(user: User) {
  return `Hello, ${user.name}`
}
```

```bash
pnpm dev
```

```json
{
  "name": "my-blog",
  "private": true
}
```

---

## 9. 수평선(Horizontal rule)

아래는 수평선입니다.

---

---

## 10. 테이블(Tables)

| 컬럼 A |  컬럼 B  |     정렬 |
| :----- | :------: | -------: |
| 왼쪽   |  가운데  |   오른쪽 |
| `code` | **bold** | _italic_ |

---

## 11. 이스케이프(Escapes)

다음 특수문자를 그대로 표시하려면 백슬래시로 이스케이프 합니다.

\*별표\* \_언더스코어\_ \#샾\# \[대괄호\]

---

## 12. HTML (Inline HTML)

일부 렌더러에서는 HTML을 허용합니다.

<div style="padding: 12px; border: 1px solid #ccc; border-radius: 8px;">
  <strong>HTML Block</strong><br />
  <em>이 영역은 HTML로 작성되었습니다.</em>
</div>

---

## 13. 각주(Footnotes)

각주 예시입니다.[^note1]

[^note1]: 이것은 각주 내용입니다. 여러 문장도 가능합니다.

---

## 14. 코드 인용 / 키보드 표기 느낌

- 키 입력을 이런 식으로 적고 싶을 때: `Cmd` + `K`

---

## 15. 긴 텍스트(타이포/줄간격 확인)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

---

## 16. 혼합 예시(리스트 + 코드 + 인용)

1. 먼저 설치
   - `pnpm i`
2. 실행
   - `pnpm dev`
3. 결과 확인
   > 브라우저에서 `http://localhost:3000` 접속

---

## 17. 인라인 코드/코드 강조 조합

- `const value = 1` 같은 인라인 코드
- **`강조된 코드`** 같은 조합
- `backtick` 안에서는 _기울임_ 이나 **굵게**가 적용되지 않습니다.

---

## 18. 줄바꿈/공백 테스트

문장 끝에 공백 2개를 넣으면 강제 줄바꿈이 됩니다.  
이 줄은 같은 문단입니다.

빈 줄을 넣으면 새 문단이 됩니다.

---

## 19. 접기/펼치기(HTML details)

<details>
  <summary>펼치기</summary>
  <p>이 내용은 접었다 펼 수 있습니다.</p>
  <p><strong>굵게</strong> / <em>기울임</em>도 섞어볼 수 있습니다.</p>
</details>

---

## 20. 인용 + 체크박스 혼합

> 할 일 목록 (인용 안)
>
> - [x] 마크다운 렌더링
> - [ ] 스타일 점검
> - [ ] 다크모드 확인

---

## 21. 특수문자/이모지(?) 처리

- 기호: ! @ # $ % ^ & \* ( )
- 따옴표: "double" / 'single'
- 괄호: (paren) [bracket] {brace}

---

## 22. `pre` 느낌(들여쓰기 코드 블록)

아래는 fenced code block이 아니라, 4칸 들여쓰기로 만든 코드입니다.

    function sum(a, b) {
      return a + b
    }

---

## 23. diff 코드 블록

```diff
- const oldValue = 1
+ const newValue = 2
```

---

## 24. 상대 링크/앵커 링크

- 이 문서의 다른 섹션으로 이동: [테이블 섹션](#10-테이블tables)
- 상대 링크 예시: [About](/about)

---

## 25. 경고/노트 느낌(인용으로 대체)

> **NOTE**
>
> 이 섹션은 스타일(배경/테두리/여백)이 잘 보이는지 확인하기 위한 용도입니다.

---

끝.
