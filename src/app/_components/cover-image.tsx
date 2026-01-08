import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  title: string
  src: string
  slug?: string
}

const CoverImage = ({ title, src, slug }: Props) => {
  const image = (
    <div
      className={cn('relative w-full overflow-hidden shadow-sm aspect-[2/1]', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
    >
      <Image
        src={src}
        alt={`Cover Image for ${title}`}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
      />
    </div>
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
