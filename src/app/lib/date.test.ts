import { describe, it, expect } from 'vitest'
import { isValidDate } from './date'

describe('isValidDate', () => {
  it('YYYY-MM-DD 형식의 유효한 날짜면 true', () => {
    expect(isValidDate('2026-01-22')).toBe(true)
    expect(isValidDate('2024-02-29')).toBe(true) // 윤년
  })

  it('YYYY-MM-DD 형식이지만 존재하지 않는 날짜면 false', () => {
    expect(isValidDate('2024-02-30')).toBe(false)
    expect(isValidDate('2024-13-01')).toBe(false)
    expect(isValidDate('2024-00-10')).toBe(false)
    expect(isValidDate('2024-01-00')).toBe(false)
  })

  it('YYYY-MM-DDTHH:mm 형식의 유효한 날짜면 true', () => {
    expect(isValidDate('2026-01-22T09:30')).toBe(true)
    expect(isValidDate('2024-02-29T00:00')).toBe(true)
  })

  it('YYYY-MM-DDTHH:mm 형식이지만 존재하지 않는 시간이면 false', () => {
    expect(isValidDate('2026-01-22T24:00')).toBe(false)
    expect(isValidDate('2026-01-22T23:60')).toBe(false)
  })

  it('파싱 자체가 불가능한 문자열이면 false', () => {
    expect(isValidDate('not-a-date')).toBe(false)
    expect(isValidDate('2026/01/22')).toBe(false)
    expect(isValidDate('2026-01-22 09:30')).toBe(false)
  })

  it('형식이 깨진 경우 false', () => {
    expect(isValidDate('2026-1-2')).toBe(false)
    expect(isValidDate('2026-01-22T9:30')).toBe(false)
    expect(isValidDate('2026-01-22T09:3')).toBe(false)
  })
})
