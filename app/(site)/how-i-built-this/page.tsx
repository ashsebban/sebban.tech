import { Metadata } from "next";
import { SITE_NAME, CHANGELOG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Build Log",
  description: `A running record of how ${SITE_NAME} built this site — what shipped and why.`,
};

export default function HowIBuiltThisPage() {
  return (
    <div className="px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Build Log</h1>
        <p className="text-lg text-muted leading-relaxed mb-16">
          A running record of what shipped and why. Each entry reflects a real decision, not a generated summary.
        </p>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-10">
            {CHANGELOG.map((entry) => (
              <div key={entry.date} className="md:flex md:gap-8">
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
