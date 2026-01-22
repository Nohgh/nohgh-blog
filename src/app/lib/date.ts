const BASE_DATE_LENGTH = 10
const DATE_TIME_SPLIT_WORD = 'T'
const DATE_SEPARATOR = '-'
const TIME_SEPARATOR = ':'

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/
const DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

export function isValidDate(value: string): boolean {
  if (DATE_ONLY_REGEX.test(value)) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return false

    const [년, 월, 일] = value.split(DATE_SEPARATOR).map(Number)
    return date.getFullYear() === 년 && date.getMonth() + 1 === 월 && date.getDate() === 일
  }

  if (DATE_TIME_REGEX.test(value)) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return false

    const [datePart, timePart] = value.split(DATE_TIME_SPLIT_WORD)
    const [년, 월, 일] = datePart.split(DATE_SEPARATOR).map(Number)
    const [시, 분] = timePart.split(TIME_SEPARATOR).map(Number)

    return (
      date.getFullYear() === 년 &&
      date.getMonth() + 1 === 월 &&
      date.getDate() === 일 &&
      date.getHours() === 시 &&
      date.getMinutes() === 분
    )
  }

  return false
}
