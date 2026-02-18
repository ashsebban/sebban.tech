import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How I Built This",
  description: `How ${SITE_NAME} built this site using AI-assisted development — from information architecture to deployment.`,
};

export default function HowIBuiltThisPage() {
  return (
    <div className="px-6 py-24">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          How I Built This Site
        </h1>
        <p className="text-lg text-muted leading-relaxed mb-16">
          This entire site was designed and built using AI-assisted development.
          Not &quot;AI generated&quot; — directed, decided, and shaped by me,
          with AI as the engine.
        </p>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-semibold mb-4 pl-4 border-l-2 border-accent">
              The Approach
            </h2>
            <p className="text-muted leading-relaxed">
              I started with a question most people skip: who is actually going
              to visit this site, and what do they need? The answer — recruiters
              and hiring managers doing pre-interview research — shaped every
              decision that followed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 pl-4 border-l-2 border-accent">
              Information Architecture
            </h2>
            <p className="text-muted leading-relaxed">
              Instead of a generic portfolio template, I worked with Claude to
              rethink the site structure from the visitor&apos;s perspective. We
              stripped out self-promotional content (skills badges, interests
              lists) and replaced it with evidence-based sections that answer the
              questions a hiring manager actually has: Can this person do the
              work? What&apos;s their story? Would they fit our team?
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 pl-4 border-l-2 border-accent">
              Content Strategy
            </h2>
            <p className="text-muted leading-relaxed">
              Every piece of copy was workshopped — not generated and accepted,
              but iterated on. The tagline, the &quot;What I Do&quot;
              descriptions, the proof highlights — each went through rounds of
              refinement where I pushed back on generic language and shaped the
              voice to sound like me, not like a template.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 pl-4 border-l-2 border-accent">
              Technical Build
            </h2>
            <p className="text-muted leading-relaxed">
              The site runs on Next.js with TypeScript, styled with Tailwind
              CSS. Claude handled the component architecture, but I made the
              structural decisions: what goes in constants vs. components, how
              pages should be organized, what dependencies to keep and what to
              cut. We started by stripping all existing styling to a blank
              canvas, then rebuilt with intention.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 pl-4 border-l-2 border-accent">
              The Point
            </h2>
            <p className="text-muted leading-relaxed">
              This isn&apos;t &quot;AI built my website.&quot; It&apos;s
              &quot;I used AI as a force multiplier to build something I
              couldn&apos;t have built alone in this timeframe, at this
              quality.&quot; I brought the product thinking, the taste, and the
              decisions. AI brought the speed and technical execution. That
              combination is the skill.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
