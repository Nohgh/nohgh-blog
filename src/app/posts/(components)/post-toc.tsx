import styles from './post-toc-scroll.module.css'
import { TocLink } from '@/lib/markdownToHtml'

interface Props {
  toc: TocLink[]
}

export default function PostIsland({ toc }: Props) {
  return (
    <nav
      className={`${styles['toc-scroll']} fixed top-36 right-12 w-64 max-h-[calc(100vh-9rem)] pb-6 overflow-y-auto hidden xl:inline-block`}
    >
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="block border-l dark:border-neutral-700 px-4 py-1 text-neutral-500 dark:text-neutral-500"
        >
          {item.text}
        </a>
      ))}
    </nav>
  )
}
