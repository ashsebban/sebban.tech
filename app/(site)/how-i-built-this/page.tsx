import { Metadata } from "next";
import { SITE_NAME, CHANGELOG } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Build Notes",
  description: `How ${SITE_NAME} built this site: the AI workflow, tools used, and a running log of decisions.`,
};

export default function HowIBuiltThisPage() {
  return (
    <div className="px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Build Notes</h1>
          <p className="text-lg text-muted leading-relaxed mb-16">
            How this site was built, what tools were used, and a running log of decisions. Each entry reflects something real.
          </p>
        </FadeIn>

        {/* AI Workflow section */}
        <FadeIn delay={0.1}>
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How This Site Was Built</h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            This site was developed using an AI-assisted workflow designed to move quickly from idea to working product.
          </p>

          <div className="mb-8">
            <p className="text-xs text-muted uppercase tracking-wide mb-3">Tools used</p>
            <ul className="space-y-2">
              {[
                { name: "Anthropic", desc: "Architectural reasoning, debugging, and implementation" },
                { name: "OpenAI", desc: "Copy editing, structural thinking, and prompt refinement" },
                { name: "GitHub", desc: "Version control and deployment management" },
                { name: "Vercel", desc: "Hosting and continuous deployment" },
              ].map((t) => (
                <li key={t.name} className="flex gap-3 text-sm">
                  <span className="font-medium text-foreground w-28 flex-shrink-0">{t.name}</span>
                  <span className="text-muted">{t.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs text-muted uppercase tracking-wide mb-3">Development pattern</p>
            <ol className="space-y-2">
              {[
                "Generate an initial working artifact quickly.",
                "Step back and evaluate the architecture.",
                "Rewrite sections intentionally rather than iterating blindly.",
                "Use AI to assist with targeted improvements while maintaining control of the system design.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted">
                  <span className="text-accent font-medium flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="text-sm text-muted mt-4 leading-relaxed">
              The goal wasn't just to generate code. It was to learn how to move from idea to artifact to working product using AI effectively.
            </p>
          </div>
        </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 className="text-2xl font-bold mb-8">Build Log</h2>
        </FadeIn>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-10">
            {CHANGELOG.map((entry, i) => (
              <FadeIn key={entry.date} delay={i * 0.07}>
              <div className="md:flex md:gap-8">
                {/* date column */}
                <div className="md:w-30 flex-shrink-0 mb-2 md:mb-0 md:text-right">
                  <span className="text-sm text-muted">{entry.label}</span>
                </div>

                {/* dot + content */}
                <div className="relative md:pl-8 flex-1">
                  {/* dot on the line */}
                  <div className="absolute left-[-0.3rem] top-[0.35rem] w-2.5 h-2.5 rounded-full bg-accent hidden md:block" />
                  <h2 className="text-base font-semibold text-foreground mb-1">
                    {entry.feature}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">{entry.note}</p>
                </div>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
