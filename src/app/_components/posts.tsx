import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";

type Props = {
  posts: Post[];
};

export function Posts({ posts }: Props) {
  return (
    <section>
      {/* <h3 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
        개발
      </h3> */}
      <div className="font-gowun grid grid-cols-1 md:grid-cols-1 md:gap-x-16 lg:gap-x-32 gap-y-11 md:gap-y-16 mb-32">
        {posts.map(post => (
          <PostPreview key={post.slug} title={post.title} date={post.date} slug={post.slug} />
        ))}
      </div>
    </section>
  );
}
