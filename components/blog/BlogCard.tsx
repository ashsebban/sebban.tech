"use client";

// Card for one blog post on the blog index: date, title link, excerpt, tags, "Read more"
import Link from "next/link";
import { BlogPost } from "@/lib/types";
import { format } from "date-fns";
import FadeIn from "@/components/motion/FadeIn";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  return (
    <FadeIn delay={index * 0.1}>
      <article className="group p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
        <time dateTime={post.date} className="text-xs text-muted mb-3">
          {format(new Date(post.date), "MMMM dd, yyyy")}
        </time>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
          {post.excerpt}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
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

        <Link
          href={`/blog/${post.slug}`}
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          Read more &rarr;
        </Link>
      </article>
    </FadeIn>
  );
}
