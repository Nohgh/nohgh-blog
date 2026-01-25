# Nohgh Blog

안녕하세요. 노기훈 블로그입니다.

### script

```ts
// 개발 서버 실행
pnpm dev

// RSS 생성 후 프로덕션 빌드
pnpm build

// 프로덕션 서버 실행
pnpm start

// 테스트 실행
pnpm test

// 테스트 커버리지 확인
pnpm test:coverage

// 코드 린트 검사
pnpm lint

// 코드 린트 자동 수정
pnpm lint:fix

// 코드 포맷팅
pnpm format

// 코드 포맷 검사
pnpm format:check

// TypeScript 타입 검사
pnpm type:check

// QR 코드 생성
pnpm qr

// 블로그 CLI 도구
pnpm blog

// RSS 피드 생성
pnpm generate:rss
```

---

> [!TIP]
> 테스트 파일, 스타일시트, 타입 정의 등 관련 파일들을 자동으로 그룹화하여 탐색 효율을 높이기 위해 VS Code File Nesting을 사용하고 있습니다. 링크를 참조해주세요.

https://code.visualstudio.com/updates/v1_64#_explorer-file-nesting

```json
"explorer.fileNesting.patterns": {
   "*.ts": "${capture}.test.ts, ${capture}.spec.ts, ${capture}.d.ts",
   "*.js": "${capture}.js.map, ${capture}.min.js, ${capture}.d.ts, ${capture}.test.js, ${capture}.spec.js",
   "*.tsx": "${capture}.test.tsx, ${capture}.spec.tsx, ${capture}.stories.tsx, ${capture}.css, ${capture}.module.css, ${capture}.scss, ${capture}.module.scss",
}
```

<img src="https://velog.velcdn.com/images/kiki01111/post/9b948185-3eac-4346-9c1f-41bfd7b43d70/image.png" alt="alt text" width="400" />
