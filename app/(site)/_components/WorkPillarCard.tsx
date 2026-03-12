"use client";

import { useState } from "react";
import type { WorkPillar } from "@/lib/types";

const card =
  "p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300 hover:-translate-y-0.5 flex flex-col";

interface Props {
  item: WorkPillar;
  onPreview?: () => void;
}

export default function WorkPillarCard({ item, onPreview }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={card}>
      <h3 className="text-lg font-semibold">{item.capability}</h3>
      <p className="text-sm text-muted leading-relaxed mt-2">{item.capabilityDesc}</p>

      {isOpen && (
        <>
          <hr className="my-4 border-border" />
          <div className="flex flex-col gap-4 flex-1">
            {item.examples.map((example) => {
              const titleRow = (
                <span className="flex items-center gap-1 flex-wrap">
                  <span className="text-sm font-medium text-foreground">{example.title}</span>
                  {example.preview && (
                    <span className="text-xs text-accent ml-1">Preview →</span>
                  )}
                </span>
              );

              const content = (
                <div className="flex gap-2 items-start">
                  <span className="text-muted flex-shrink-0 text-sm">↳</span>
                  <div>
                    {titleRow}
                    <p className="text-sm text-muted leading-relaxed mt-0.5">
                      {example.description}
                    </p>
                  </div>
                </div>
              );

              if (example.preview && onPreview) {
                return (
                  <button
                    key={example.title}
                    onClick={onPreview}
                    className="text-left w-full"
                  >
                    {content}
                  </button>
                );
              }

              if (example.href) {
                return (
                  <a key={example.title} href={example.href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                );
              }

              return <div key={example.title}>{content}</div>;
            })}
          </div>
        </>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-4 text-xs text-muted hover:text-foreground transition-colors text-left"
      >
        {isOpen ? "Hide ↑" : "Show work →"}
      </button>
    </div>
  );
}
