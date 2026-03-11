// Blog post page: dynamic route [slug], renders MDX with next-mdx-remote; static params from getAllPostSlugs
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { format } from "date-fns";
import Link from "next/link";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render all blog post routes at build time */
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Set page title and description from post frontmatter */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="px-6 py-24">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="text-sm text-muted hover:text-accent transition-colors"
        >
          &larr; Back to Blog
        </Link>

        <header className="mt-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <time dateTime={post.date} className="text-sm text-muted">
            {format(new Date(post.date), "MMMM dd, yyyy")}
          </time>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full border border-border text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Render Markdown/MDX body with Tailwind typography */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
