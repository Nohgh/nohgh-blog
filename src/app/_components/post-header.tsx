import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";

type Props = {
  title: string;
  coverImage: string;
  date: string;
};

export function PostHeader({ title, coverImage, date }: Props) {
  return (
    <div className="mt-6">
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
  );
}
