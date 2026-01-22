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
})
