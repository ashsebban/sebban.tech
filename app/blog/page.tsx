// Blog index: lists all posts from content/blog as cards (getAllPosts)
import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my latest articles and thoughts",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted">
            Insights on product management, UX research, AI, and building better systems.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted">No blog posts yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Staggered FadeIn via index passed to BlogCard */}
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
