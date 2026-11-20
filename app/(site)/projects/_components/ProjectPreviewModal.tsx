"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface ProjectPreviewModalProps {
  title: string;
  embedUrl: string;
  deployUrl: string;
  onClose: () => void;
}

export default function ProjectPreviewModal({ title, embedUrl, deployUrl, onClose }: ProjectPreviewModalProps) {
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <Modal
      title={title}
      onClose={onClose}
      actions={
        <a
          href={deployUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-sm text-accent hover:text-accent-hover"
        >
          Open directly
        </a>
      }
    >
      <div className="game-preview-frame flex min-h-0 flex-col overflow-hidden">
        {loadFailed ? (
          <div className="grid h-full place-items-center overflow-y-auto p-6 text-center">
            <p className="text-sm text-foreground">The preview couldn’t load. Use Open directly to open the game directly.</p>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            className="min-h-0 w-full flex-1 border-0"
            onError={() => setLoadFailed(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
          />
        )}
      </div>
    </Modal>
  );
}
