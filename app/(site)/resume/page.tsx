"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RESUME_PDF_PATH } from "@/lib/constants";

type CopyButtonState = "idle" | "loading" | "copied";

export default function ResumePage() {
  const [copyButtonState, setCopyButtonState] =
    useState<CopyButtonState>("idle");
  const [fillProgress, setFillProgress] = useState(0);
  const [fillTransitionEnabled, setFillTransitionEnabled] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fixedButtonClass =
    "inline-flex h-9 w-44 items-center justify-center rounded-lg px-3 text-sm font-medium";

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const copyResumeText = async () => {
    const response = await fetch("/resume-content.txt", { cache: "no-store" });
    if (response.ok) {
      const text = (await response.text()).trim();
      if (text.length > 0) {
        await navigator.clipboard.writeText(text);
        return;
      }
    }
    await navigator.clipboard.writeText(window.location.origin + RESUME_PDF_PATH);
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const handleCopyResumeContent = async () => {
    if (copyButtonState !== "idle") return;

    setCopyButtonState("loading");
    setFillTransitionEnabled(false);
    setFillProgress(0);

    requestAnimationFrame(() => {
      setFillTransitionEnabled(true);
      setFillProgress(100);
    });

    try {
      await Promise.all([copyResumeText(), sleep(1000)]);
      await sleep(225);
      setFillTransitionEnabled(false);
      setFillProgress(0);
      setCopyButtonState("copied");
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = setTimeout(() => {
        setCopyButtonState("idle");
      }, 5000);
    } catch {
      setFillTransitionEnabled(false);
      setFillProgress(0);
      setCopyButtonState("idle");
      window.alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative min-h-screen">
      <iframe
        src={`${RESUME_PDF_PATH}#toolbar=1&navpanes=0`}
        title="Asher Sebban Resume"
        className="w-full h-[120vh] md:h-[150vh] border-0"
      />

      <div className="sticky bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={RESUME_PDF_PATH}
                download
                className={`${fixedButtonClass} bg-accent text-white hover:bg-accent-hover transition-colors`}
              >
                Download
              </a>
              <button
                type="button"
                onClick={handleCopyResumeContent}
                className={`relative ${fixedButtonClass} overflow-hidden border transition-all duration-300 ${
                  copyButtonState === "copied"
                    ? "border-black bg-black text-white"
                    : copyButtonState === "loading"
                      ? "border-blue-500 bg-black text-white"
                    : "border-transparent bg-card-hover text-foreground hover:bg-accent hover:text-white"
                }`}
              >
                <span
                  className="absolute inset-y-0 left-0 bg-blue-500"
                  style={{
                    width: `${fillProgress}%`,
                    transition: fillTransitionEnabled
                      ? "width 1000ms cubic-bezier(0.7, 0, 1, 1)"
                      : "none",
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10 inline-flex items-center gap-2">
                  {copyButtonState === "copied" ? (
                    <>
                      <span>Copied</span>
                      <span className="text-emerald-400 text-base leading-none">✓</span>
                    </>
                  ) : (
                    <>Copy to Clipboard</>
                  )}
                </span>
              </button>
              <Link
                href="/references"
                className={`${fixedButtonClass} bg-card-hover text-foreground hover:bg-accent hover:text-white transition-colors`}
              >
                References
              </Link>
              <Link
                href="/"
                className={`${fixedButtonClass} bg-card-hover text-foreground hover:bg-accent hover:text-white transition-colors`}
              >
                Back to Main
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
