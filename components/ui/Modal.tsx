"use client";

import { useEffect } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: "md" | "xl";
}

export default function Modal({ title, onClose, children, actions, size = "xl" }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className={`relative z-10 flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl ${size === "md" ? "max-w-lg" : "max-w-[1200px]"}`}>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <div className="flex items-center gap-4">
            {actions}
            <button
              onClick={onClose}
              className="text-xl leading-none text-muted transition-colors hover:text-foreground"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
