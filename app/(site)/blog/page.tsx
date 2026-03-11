import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "./_components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my latest articles and thoughts",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Blog</h1>
          <p className="text-lg text-muted">Insights on product management, UX research, AI, and building better systems.</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted">No blog posts yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
