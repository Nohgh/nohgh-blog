import { PostTitle } from './post-title'
import CoverImage from '@app/layout/cover-image'
import DateFormatter from '@app/layout/date-formatter'

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
