import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";

type Props = {
  posts: Post[];
};

export function Posts({ posts }: Props) {
  const postsByYear = new Map<string, Post[]>();

  for (const post of posts) {
    const year = post.date.split(" ")[0].split("-")[0];
    const bucket = postsByYear.get(year);
    if (bucket) {
      bucket.push(post);
    } else {
      postsByYear.set(year, [post]);
    }
  }
  console.log(postsByYear);
  return (
    <section className="font-gowun mb-32">
      {Array.from(postsByYear.entries()).map(([year, yearPosts]) => (
        <div key={year} className="mb-16 pb-5 border-b grayscale">
          <h1 className="mb-8 text-xl md:text-2xl font-bold tracking-tighter leading-tight font-bold">
            {year}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-x-16 lg:gap-x-32 gap-y-11 md:gap-y-16">
            {yearPosts.map((post) => (
              <PostPreview
                key={post.slug}
                title={post.title}
                date={post.date}
                slug={post.slug}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
