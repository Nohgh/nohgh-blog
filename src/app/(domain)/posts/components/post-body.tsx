import postBodyStyle from './post-body.module.css'

type Props = {
  content: string
}

export function PostBody({ content }: Props) {
  return (
    <div className=" font-gowun max-w-full mx-auto relative ">
      <div className={postBodyStyle['markdown']} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
