---
title: 리액트에서 xss 공격을 처리하는 다양한 방법
date: '2025-12-12'
coverImage: ''
ogImage:
  url: /assets/blog/react-xss/251212-escapehtml-test-code.png
images:
  - /assets/blog/react-xss/251212-escapehtml-test-code.png
---

> 이번 포스트에서는 리액트에서 xss 공격을 처리하는 다양한 방법들을 알아보고자 합니다.

리액트에서 사용하는 jsx에 대해 찾아보다가 jsx단에서 xss 공격을 방어한다는 [공식문서](https://ko.legacy.reactjs.org/docs/introducing-jsx.html) 의 내용을 시작으로 jsx외에도 다른 방법으로 xss 공격을 어떻게 방어하며, 어떤식으로 테스트를 진행하는지 궁금했습니다.

본격적인 분석에 앞서 xss 공격에 대해서 먼저 알아보겠습니다.

[xss 공격이란](<https://developer.mozilla.org/ko/docs/Web/Security/Attacks#:~:text=%EC%9A%A9%EC%96%B4%EB%A5%BC%20%EC%98%A4%EC%9A%A9%ED%95%9C%20%EA%B2%83%EC%9E%85%EB%8B%88%EB%8B%A4.%EA%B5%90%EC%B0%A8%20%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8C%85%20(XSS),-%EA%B5%90%EC%B0%A8%20%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8C%85>) 교차 사이트 스크립팅의 약자로 공격자가 웹사이트에 악성 클라이언트 측 코드를 주입할 수 있는 공격입니다.
xss 공격이라고 구글링을 통해서 바로 공격법을 익힐 수 있는 만큼 낮은 난이도지만 강력한 방법으로 측정됩니다.

(xss 공격을 간단히 배울 수 있는 링크들입니다.)

- [XSS 공격을 직접 해보면서 알아보기(dangerouslySetInnerHTML는 얼마나 위험할까?)](https://dj-min43.medium.com/xss-%EA%B3%B5%EA%B2%A9%EC%9D%84-%EC%A7%81%EC%A0%91-%ED%95%B4%EB%B3%B4%EB%A9%B4%EC%84%9C-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-c2c1d9baf7ec)
- [[Web Hacking] XSS(Cross-Site Scripting) : 실습 및 대응 방안 #2](https://securityhacker.tistory.com/entry/Web-Hacking-XSS-2)

&nbsp;

## jsx로 xss를 막는 방법

> jsx에 사용자 입력을 삽입하는것은 안전합니다.
>
> ```tsx
> const title = response.potentiallyMaliciousInput
> // 이것은 안전합니다.
> const element = <h1>{title}</h1>
> ```
>
> 기본적으로 React DOM은 JSX에 삽입된 모든 값을 렌더링하기 전에 이스케이프 하므로, 애플리케이션에서 명시적으로 작성되지 않은 내용은 주입되지 않습니다. 모든 항목은 렌더링 되기 전에 문자열로 변환됩니다. 이런 특성으로 인해 XSS (cross-site-scripting) 공격을 방지할 수 있습니다.

.
.
.
위의 내용은 리액트의 공식문서중 jsx부분에서 발췌해온 내용입니다.

jsx에서 어떻게 위의 동작을 수행하는지 직접 구현체를 찾아서 살펴보겠습니다.

https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/server/escapeTextForBrowser.js
escapeHtml, escapeTextForBrowser에서 그 해답을 찾을 수 있습니다.

밑의 코드는 주석부분을 알기 쉽게 번역한 코드입니다.

```js

// escape-html에서 코드를 복사하고 수정한다.
/**
 * Module variables.
 * @private
 */

import {checkHtmlStringCoercion} from 'shared/CheckStringCoercion';

const matchHtmlRegExp = /["'&<>]/;

/**
 * 주어진 HTML 문자열에서 특수문자와 HTML 엔티티를 이스케이프 처리합니다.
 *
 * @param  {string} string 나중에 삽입하기 위해 이스케이프할 HTML 문자열
 * @return {string}
 * @public
 */

function escapeHtml(string: string) {
  if (__DEV__) {
    checkHtmlStringCoercion(string);
  }
  const str = '' + string;
  const match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  let escape;
  let html = '';
  let index;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#x27;'; // escape-html에서 수정됨; 이전에는 '&#39'였음
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.slice(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
}
// escape-html에서 복사한 코드 끝

/**
 * 스크립팅 공격을 방지하기 위해 텍스트를 이스케이프합니다.
 *
 * @param {*} text 이스케이프할 텍스트 값.
 * @return {string} 이스케이프된 문자열.
 */
function escapeTextForBrowser(text: string | number | boolean): string {
  if (
    typeof text === 'boolean' ||
    typeof text === 'number' ||
    typeof text === 'bigint'
  ) {
    // 이 단축 처리는 특수문자가 절대 없을 것으로 알려진 타입의 성능을 도와줍니다.
    // 특히 이 함수가 숫자 DOM ID에 자주 사용되기 때문입니다.
    return '' + (text: any);
  }
  return escapeHtml(text);
}

export default escapeTextForBrowser;


```

코드를 분석해보자면 export 되는 함수인 escateTextForBrouswer는 text를 받아서 boolean, number, bigint인 경우 안전한 경우로 판단해서 즉시 반환하고
문자열에 대해서 escapeHtml함수를 통해 이스케이프 처리를 한다는것을 알 수 있습니다.

따라서 escapeHtml에서 실제 이스케이프 로직을 처리합니다.

escapeHtml에서는 matchHtmlRegExp인 <, >, &, ", '를 위험 요소로 판단합니다. 해당 정규식으로 필터링하여 위험요소가 없으면 바로 반환을하고 그렇지 않은 위험한 요소라면 밑의 switch로 넘어감니다.

```js
switch (str.charCodeAt(index)) {
  case 34:
    escape = '&quot;'
    break // "  → &quot;
  case 38:
    escape = '&amp;'
    break // &  → &amp;
  case 39:
    escape = '&#x27;'
    break // '  → &#x27;
  case 60:
    escape = '&lt;'
    break // <  → &lt;
  case 62:
    escape = '&gt;'
    break // >  → &gt;
}
```

해당 switch에서는 문자열을 순회하며 정규식에서의 위험 문자를 안전한 문자로 바꾸는 과정을 합니다.

// input: "<script>alert('xss')</script>"
// output: "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"

위와 같이 escapeHtml함수에서 위험한 문자열을 이스케이프 처리를해서 보다 안전한 데이터로 가공을 하는것을 알 수 있습니다.

&nbsp;

### escape 테스트코드

https://github.com/facebook/react/blob/main/packages/react-dom/src/__tests__/escapeTextForBrowser-test.js

**위 코드는 escape처리에 대한 테스트코드입니다. 테스트를 쉽게 이해하기 위해 각 it절 위에 한글로 번역을 해보았습니다.**

(뒤로 나오는 모든 테스트코드는 it절에 집중하기 위해 Setup, Teardown 부분은 제외합니다.)

```js
describe('escapeTextForBrowser', () => {
  // 앰퍼샌드(&)가 텍스트 내용으로 전달될 때 이스케이프 된다
  it('ampersand is escaped when passed as text content', () => {
    const response = ReactDOMServer.renderToString(<span>{'&'}</span>)
    expect(response).toMatch('<span>&amp;</span>')
  })

  // 큰따옴표(")가 텍스트 내용으로 전달될 때 이스케이프 된다
  it('double quote is escaped when passed as text content', () => {
    const response = ReactDOMServer.renderToString(<span>{'"'}</span>)
    expect(response).toMatch('<span>&quot;</span>')
  })

  // 작은따옴표(')가 텍스트 내용으로 전달될 때 이스케이프 된다
  it('single quote is escaped when passed as text content', () => {
    const response = ReactDOMServer.renderToString(<span>{"'"}</span>)
    expect(response).toMatch('<span>&#x27;</span>')
  })

  // '>' 문자가 텍스트 내용으로 전달될 때 이스케이프 된다
  it('greater than entity is escaped when passed as text content', () => {
    const response = ReactDOMServer.renderToString(<span>{'>'}</span>)
    expect(response).toMatch('<span>&gt;</span>')
  })

  // '>' 문자가 텍스트 내용으로 전달될 때 이스케이프 된다
  it('lower than entity is escaped when passed as text content', () => {
    const response = ReactDOMServer.renderToString(<span>{'<'}</span>)
    expect(response).toMatch('<span>&lt;</span>')
  })

  // 숫자가 텍스트 내용으로 올바르게 전달된다.
  it('number is correctly passed as text content', () => {
    const response = ReactDOMServer.renderToString(<span>{42}</span>)
    expect(response).toMatch('<span>42</span>')
  })

  // 숫자가 문자열로 변환되어 이스케이프 된다
  it('number is escaped to string when passed as text content', () => {
    const response = ReactDOMServer.renderToString(<img data-attr={42} />)
    expect(response).toMatch('<img data-attr="42"/>')
  })

  // 스크립트 태그를 나타내는 텍스트 내용이 이스케이프 된다
  it('escape text content representing a script tag', () => {
    const response = ReactDOMServer.renderToString(
      <span>{'<script type=\'\' src=""></script>'}</span>,
    )
    expect(response).toMatch(
      '<span>&lt;script type=&#x27;&#x27; ' + 'src=&quot;&quot;&gt;&lt;/script&gt;</span>',
    )
  })
})
```

해당 테스트를 통해서 escapeHtml, escapeTextForBrowser함수를 검증하는것을 확인할 수 있습니다.

![escapeHtml-test-code](/assets/blog/react-xss/251212-escapehtml-test-code.png)

&nbsp;

## Reflected XSS 방어를 위한 URL 검증과 sanitizeURL

[Reflected XSS](https://portswigger.net/web-security/cross-site-scripting/reflected)는 악성 스크립트가 담긴 URL을 만들어서 일반 사용자에게 전달하는 공격으로 url 주소뒤에 붙은 쿼리에 악성 스크립트를 작성하여 전달합니다.

밑의 코드에서 Reflected XSS를 방어하는것을 볼 수 있습니다.

https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/shared/sanitizeURL.js

```js

const isJavaScriptProtocol =
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;

function sanitizeURL<T>(url: T): T | string {
  // 여기에는 심볼이 있어서는 안 됩니다. 다른 곳에서 필터링되기 때문입니다.
  if (isJavaScriptProtocol.test('' + (url: any))) {
    // 부작용을 일으키지 않고 방문 시 에러를 던지는 다른 javascript: URL을 반환합니다.
    return "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')";
  }
  return url;
}

export default sanitizeURL;
```

해당 코드는 isJavaScriptProtocol 정규식을 분석하여 해당 정규식을 만족하면 'javascript:throw new Error'를 리턴합니다.

isJavaScriptProtocal 정규식에서는 어떤것을 잡고자 하는지 더 자세히 보겠습니다.

아래는 isJavaScriptProtocol위에 작성되어있던 주석 원문입니다.

```js
// A javascript: URL can contain leading C0 control or \u0020 SPACE,
// and any newline or tab are filtered out as if they're not part of the URL.
// https://url.spec.whatwg.org/#url-parsing
// Tab or newline are defined as \r\n\t:
// https://infra.spec.whatwg.org/#ascii-tab-or-newline
// A C0 control is a code point in the range \u0000 NULL to \u001F
// INFORMATION SEPARATOR ONE, inclusive:
// https://infra.spec.whatwg.org/#c0-control-or-space

const isJavaScriptProtocol =
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i
```

해당 주석은 차례대로 다음을 설명합니다.

1. javascript: URL의 맨 앞 공백/제어 문자를 허용
   - URL이 " javascript:alert(1)"처럼 공백이나 ASCII 제어 문자로 시작해도 브라우저는 이를 무시하고 javascript:로 인식할 수 있습니다.
2. 개행(\n, \r)과 탭(\t) 무시
   - URL 안에 줄 바꿈이나 탭 문자가 있어도 브라우저는 이를 URL의 일부가 아닌 것처럼 처리합니다.
3. 개행과 탭 정의
   - 여기서 말하는 개행과 탭은 **\r(캐리지 리턴), \n(줄 바꿈), \t(탭)**으로 명확히 정의되어 있습니다.
4. C0 제어 문자 정의
   - C0 제어 문자는 Unicode 코드 포인트 \u0000부터 \u001F까지 포함합니다.

즉. JavaScript 프로토콜 URL의 다양한 우회 시도(공백, 제어문자, 개행문자 등)를 모두 감지하기 위한 정규식 패턴입니다.

아래는 공격자가 시도할 수 있는 우회 방법이며 모두 위의 정규식을 통해서 true로 반환됩니다.

```js
// 1. 선행 공백과 제어문자
' javascript:alert(1)'

// 2. 문자 사이 개행
'ja\r\nva\r\nscr\r\nipt:alert(1)'

// 3. 탭 문자 혼합
'j\ta\tv\ta\ts\tc\tr\ti\tp\tt:alert(1)'

// 4. C0 제어 문자
'\u0001\u0002javascript:alert(1)'

// 5. 대소문자 혼합
'JAVASCRIPT:alert(1)'

// 6. 복합 우회
' \t\r\nJ\r\na\tv\r\nA\tS\tC\tR\tI\tP\tT:alert(1)'
```

&nbsp;

### sanitizeURL 테스트코드

https://github.com/facebook/react/blob/main/packages/react-dom/src/__tests__/ReactDOMServerIntegrationUntrustedURL-test.js

해당 테스트에서 sanitizeURL 함수와 직접적인 연관이 없는 테스트케이스는 제외하였습니다.

```js
describe('ReactDOMServerIntegration - Untrusted URLs', () => {
  //javascript라는 단어가 포함된 일반 HTTP 링크는 정상적으로 렌더링됨
  itRenders('a http link with the word javascript in it', async (render) => {
    const e = await render(<a href="http://javascript:0/thisisfine">Click me</a>)
    expect(e.tagName).toBe('A')
    expect(e.href).toBe('http://javascript:0/thisisfine')
  })

  // javascript: 프로토콜을 사용하는 href는 안전한 URL로 대체됨
  itRenders('a javascript protocol href', async (render) => {
    const e = await render(
      <div>
        <a href="javascript:notfine">p0wned</a>
        <a href="javascript:notfineagain">p0wned again</a>
      </div>,
    )
    expect(e.firstChild.href).toBe(EXPECTED_SAFE_URL)
    expect(e.lastChild.href).toBe(EXPECTED_SAFE_URL)
  })

  // 다양한 HTML 태그에서 javascript: 프로토콜이 모두 무해화 처리됨
  itRenders('sanitizes on various tags', async (render) => {
    const aElement = await render(<a href="javascript:notfine" />)
    expect(aElement.href).toBe(EXPECTED_SAFE_URL)

    const objectElement = await render(<object data="javascript:notfine" />)
    expect(objectElement.data).toBe(EXPECTED_SAFE_URL)

    const embedElement = await render(<embed src="javascript:notfine" />)
    expect(embedElement.src).toBe(EXPECTED_SAFE_URL)
  })

  itRenders('passes through data on non-object tags', async (render) => {})

  // 선행 공백과 제어문자가 포함된 javascript: 프로토콜이 차단됨
  itRenders('a javascript protocol with leading spaces', async (render) => {
    const e = await render(<a href={'  \t \u0000\u001F\u0003javascript\n: notfine'}>p0wned</a>)
    expect(e.href).toBe(EXPECTED_SAFE_URL)
  })

  // 개행문자와 대소문자 혼합된 javascript: 프로토콜이 차단됨
  itRenders(
    'a javascript protocol with intermediate new lines and mixed casing',
    async (render) => {
      const e = await render(<a href={'\t\r\n Jav\rasCr\r\niP\t\n\rt\n:notfine'}>p0wned</a>)
      expect(e.href).toBe(EXPECTED_SAFE_URL)
    },
  )
})
```

테스트에서 확인할 수 있듯이, sanitizeURL 함수는 다양한 우회 시도를 포함한 javascript: 프로토콜을 모두 안전하게 처리합니다. 이를 통해 Reflected XSS와 같은 공격으로부터 애플리케이션을 보호할 수 있습니다.

&nbsp;

## setProp 단계에서의 dangerouslySetInnerHTML 검증

https://github.com/facebook/react/blob/2d8e7f1ce358e8cddc3aae862007269b6bac04ba/packages/react-dom-bindings/src/client/ReactDOMComponent.js#L637C3-L637C38

ReactDOMComponent 내부의 setProp 함수는 React 컴포넌트(jsx)의 props를 실제 DOM 요소의 속성으로 변환하고 설정합니다.

```ts
function setProp(
  domElement: Element,
  tag: string,
  key: string,
  value: mixed,
  props: any,
  prevValue: mixed,
): void
```

setProp의 시그니처 입니다.

key 인자가 JSX props의 key에 해당하고 value가 key에 해당하는 값으로 아래의 switch에서 key에 따른 분리처리를 진행합니다.

```ts
switch (key) {
  case 'className':
  case 'tabIndex': // ...
  case 'dir': // ...
  case 'role': // ..
  case 'viewBox': //...
  case 'dangerouslySetInnerHTML':

  // 그 외 많은 case
}
```

key로 dangerouslySetInnerHTML가 넘오는 경우 리액트는 dangerouslySetInnerHTML로 부터 안전한(개발자로 하여금 명시된) html을 얻고자 몇 가지 보안적인 코드를 이곳에 구현하였습니다.

```ts
  case 'dangerouslySetInnerHTML': {
    // 1. null 체크
    if (value != null) {
      // 2. 형식 검증
      if (typeof value !== 'object' || !('__html' in value)) {
        throw new Error('`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. ')
      }

      // 3. html 추출
      const nextHtml: any = value.__html

      // 4. html null 체크
      if (nextHtml != null) {
        // 5. children 충돌 검사
        if (props.children != null) {
          throw new Error('Can only set one of `children` or `props.dangerouslySetInnerHTML`.')
        }

        // 6. 최종 dom 설정
        domElement.innerHTML = nextHtml
      }
    }
    break
  }
```

- 따라서 `dangerouslySetInnerHTML`은 반드시 `{__html: ...}` 형식의 객체여야 합니다.

```jsx
// 에러를 반환하는 경우들
<div dangerouslySetInnerHTML="<script>alert(1)</script>" />           // 문자열
<div dangerouslySetInnerHTML={{content: "<script>alert(1)</script>"}} /> // 잘못된 키
<div dangerouslySetInnerHTML={{html: "<script>alert(1)</script>"}} />     // 잘못된 키
<div dangerouslySetInnerHTML=({__html: "<script>alert(1)</script>"}) />   // 함수 호출
<div dangerouslySetInnerHTML={{__html: "<script>alert(1)"}}> // children 혼합
  Safe content
</div>

// 올바른 형식
<div dangerouslySetInnerHTML={{__html: "<script>alert(1)</script>"}} />
<div dangerouslySetInnerHTML={null} /> // 아무것도 렌더링되지 않는 안전한 형태
```

위에서 dangerouslySetInnerHTML를 만족하지 않는 경우
https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
해당 문서로 안내합니다.

문서에서는 개발자에게 현재 방법이 xss 취약점을 유도할 수 있다는 경고와 함께 dangerouslySetInnerHTML를 안전하게 사용하는 방법에 대해서 안내 합니다.

> ```jsx
> const markup = { __html: '<p>some raw html</p>' }
> return <div dangerouslySetInnerHTML={markup} />
> ```
>
> 이는 위험합니다. 기본 DOM innerHTML속성과 마찬가지로 극도로 주의해야 합니다! 마크업이 완전히 신뢰할 수 있는 출처에서 온 것이 아니라면, 이런 식으로 XSS 취약점을 쉽게 유발할 수 있습니다.
>
> 예를 들어, 마크다운을 HTML로 변환하는 마크다운 라이브러리를 사용하고, 해당 라이브러리의 파서에 버그가 없다고 확신하며, 사용자가 자신의 입력 내용만 볼 수 있다면 다음과 같이 결과 HTML을 표시할 수 있습니다.
>
> ```jsx
> import { Remarkable } from 'remarkable'
>
> const md = new Remarkable()
>
> function renderMarkdownToHTML(markdown) {
>   // This is ONLY safe because the output HTML
>   // is shown to the same user, and because you
>   // trust this Markdown parser to not have bugs.
>   const renderedHTML = md.render(markdown)
>   return { __html: renderedHTML }
> }
>
> export default function MarkdownPreview({ markdown }) {
>   const markup = renderMarkdownToHTML(markdown)
>   return <div dangerouslySetInnerHTML={markup} />
> }
> ```

## 마무리하며

이번 포스트에서는 React가 XSS 공격을 방어하는 세 가지 핵심 메커니즘을 살펴보았습니다:

1. **JSX 자동 이스케이프**: `escapeTextForBrowser`를 통한 문자열 이스케이프 처리
2. **URL 검증**: `sanitizeURL`을 통한 `javascript:` 프로토콜 차단
3. **dangerouslySetInnerHTML 검증**

React에서의 xss 방어에 대해 찾아보며 JSX는 기본적으로 안전하지만, 의도적으로 HTML을 주입할 때는 개발자의 주의가 필요함을 알 수 있었습니다.

React에서 JSX는 기본적으로 안전하지만, 의도적으로 HTML을 주입할 경우 개발자가 주의를 기울여야 한다는것을 배울 수 있었습니다.
또, React 내부에서 여러 XSS 관련 보안 사항을 처리해주기 때문에, 일반 개발자가 놓치기 쉬운 부분까지 보호받을 수 있는 생각과 동시에 리액트 코어를 개발하는 분들께 존경심과 감사함을 느낄 수 있었습니다.😄

모든 보안 사항을 다루지는 못했지만, 이번 포스트를 통해 프레임워크나 라이브러리 단에서 보안을 어떻게 신경 쓰고 처리하는지 간단히나마 이해하는 시간이 되었기를 바랍니다.
