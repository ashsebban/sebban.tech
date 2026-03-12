"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";

interface ProjectPreviewModalProps {
  title: string;
  embedUrl: string;
  deployUrl: string;
  onClose: () => void;
}

export default function ProjectPreviewModal({ title, embedUrl, deployUrl, onClose }: ProjectPreviewModalProps) {
  const [iframeReady, setIframeReady] = useState(false);
  const [embedBlocked, setEmbedBlocked] = useState(false);
  const openedFallback = useRef(false);

  const runtimeSrc = useMemo(() => {
    const glue = embedUrl.includes("?") ? "&" : "?";
    return `${embedUrl}${glue}v=${Date.now()}`;
  }, [embedUrl]);

  const openFallback = () => {
    if (openedFallback.current) return;
    openedFallback.current = true;
    setEmbedBlocked(true);
    window.open(deployUrl, "_blank", "noopener,noreferrer");
    console.warn("[projects.preview] embed blocked, opening fallback in new tab", {
      title,
      embedUrl,
      deployUrl,
    });
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!iframeReady) {
        openFallback();
      }
    }, 3500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [iframeReady]);

  return (
    <Modal
      title={title}
      onClose={onClose}
      actions={
        <a
          href={deployUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted transition-colors hover:text-foreground"
        >
          Open in new tab
        </a>
      }
    >
      <div className="min-h-[540px] overflow-hidden">
        {embedBlocked ? (
          <div className="flex h-[540px] flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-foreground">Preview unavailable in embedded mode, opening project in a new tab.</p>
            <a
              href={deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm text-accent transition-colors hover:text-accent-hover"
            >
              Open project
            </a>
          </div>
        ) : (
          <iframe
            src={runtimeSrc}
            title={title}
            className="h-[700px] w-full"
            style={{ border: "none", touchAction: "none" }}
            onLoad={() => setIframeReady(true)}
            onError={openFallback}
            sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
          />
        )}
      </div>
    </Modal>
  );
}
