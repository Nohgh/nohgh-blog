import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  date: string;
  slug: string;
};

export function PostPreview({ title, date, slug }: Props) {
  return (
    <div className="md:flex md:items-baseline md:justify-between">
      <h3 className="2xl:text-3xl md:text-2xl text-xl leading-snug">
        <Link href={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="md:text-lg text-base ">
        <DateFormatter dateString={date} />
      </div>
    </div>
  );
}
