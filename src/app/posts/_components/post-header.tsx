import CoverImage from '../../layout/cover-image'
import DateFormatter from '../../layout/date-formatter'
import { PostTitle } from '@/app/posts/(components)/post-title'

type Props = {
  title: string
  coverImage?: string
  date: string
}

export function PostHeader({ title, coverImage, date }: Props) {
  return (
    <div className="mt-6 cursor-default">
      <PostTitle>{title}</PostTitle>
      <div className="max-w-2xl">
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} isYear={true} />
        </div>
      </div>
      <div className="mb-4 md:mb-8 sm:mx-0">
        {coverImage && <CoverImage title={title} src={coverImage} />}
      </div>
    </div>
  )
}
