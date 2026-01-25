import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import DateFormatter from '@app/layout/date-formatter'

describe('DateFormatter', () => {
  it('기본 포맷(MM. dd)으로 날짜를 렌더링한다', () => {
    render(<DateFormatter dateString="2026-01-22" />)

    const time = screen.getByText('01. 22')
    expect(time).toBeInTheDocument()
    expect(time).toHaveAttribute('dateTime', '2026-01-22')
  })

  it('isYear가 true이면 yyyy년 MM월 d일 포맷으로 렌더링한다', () => {
    render(<DateFormatter dateString="2026-01-22" isYear />)

    const time = screen.getByText('2026년 01월 22일')
    expect(time).toBeInTheDocument()
    expect(time).toHaveAttribute('dateTime', '2026-01-22')
  })

  it('time 태그로 렌더링된다', () => {
    render(<DateFormatter dateString="2026-01-22" />)

    const time = screen.getByText('01. 22')
    expect(time.tagName).toBe('TIME')
  })

  it('월/일이 한 자리여도 0 패딩되어 포맷된다', () => {
    render(<DateFormatter dateString="2026-03-05" />)

    expect(screen.getByText('03. 05')).toBeInTheDocument()
  })

  it('isYear prop이 undefined이면 기본 포맷을 사용한다', () => {
    render(<DateFormatter dateString="2026-12-25" isYear={undefined} />)

    const time = screen.getByText('12. 25')
    expect(time).toBeInTheDocument()
    expect(time).toHaveAttribute('dateTime', '2026-12-25')
  })

  it('다른 월/일 값도 올바르게 포맷된다', () => {
    render(<DateFormatter dateString="2024-11-30" />)

    const time = screen.getByText('11. 30')
    expect(time).toBeInTheDocument()
    expect(time).toHaveAttribute('dateTime', '2024-11-30')
  })

  it('연도 포함 포맷에서 다른 날짜도 올바르게 렌더링된다', () => {
    render(<DateFormatter dateString="2023-07-15" isYear />)

    const time = screen.getByText('2023년 07월 15일')
    expect(time).toBeInTheDocument()
    expect(time).toHaveAttribute('dateTime', '2023-07-15')
  })

  it('윤년 날짜도 올바르게 처리된다', () => {
    render(<DateFormatter dateString="2024-02-29" />)

    const time = screen.getByText('02. 29')
    expect(time).toBeInTheDocument()
    expect(time).toHaveAttribute('dateTime', '2024-02-29')
  })
})
