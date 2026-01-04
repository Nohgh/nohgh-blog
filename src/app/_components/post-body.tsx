import markdownStyles from './markdown-styles.module.css'
import PostIsland from './post-island'

type Props = {
  content: string
}

export function PostBody({ content }: Props) {
  return (
    <div className=" font-gowun max-w-full mx-auto relative ">
      <div className={markdownStyles['markdown']} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
