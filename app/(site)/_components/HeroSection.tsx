import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import type { QuickActionLink } from "@/lib/types";

const QUICK_ACTION_VARIANTS = {
  primary:
    "px-6 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors",
  secondary:
    "px-6 py-3 border border-border text-foreground text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors",
  text: "inline-flex min-h-11 items-center px-3 text-sm text-muted hover:text-accent transition-colors",
} as const;

interface Props {
  name: string;
  tagline: string;
  subtitle: string;
  credibility: string;
  actions: QuickActionLink[];
}

export default function HeroSection({ name, tagline, subtitle, credibility, actions }: Props) {
  return (
    <section className="flex items-start justify-center px-6 pt-10 md:pt-14 pb-4">
      <div className="max-w-2xl text-center">
        <FadeIn>
          <Image
            src="/images/headshot2.png"
            alt={name}
            width={176}
            height={176}
            className="rounded-full border-2 border-border object-cover w-24 h-24 md:w-32 md:h-32 mx-auto mb-5"
            priority
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight">{name}</h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-4 text-xl md:text-2xl text-muted">{tagline}</p>
        </FadeIn>
        {subtitle && (
          <FadeIn delay={0.3}>
            <p className="mt-4 text-base text-muted leading-relaxed">{subtitle}</p>
          </FadeIn>
        )}
        <FadeIn delay={0.3}>
          <p className="mt-2 text-sm text-muted">{credibility}</p>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div className="mt-6 flex flex-wrap items-center gap-4 justify-center">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={QUICK_ACTION_VARIANTS[action.variant]}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
