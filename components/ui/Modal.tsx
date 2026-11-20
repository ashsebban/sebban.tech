"use client";

import { useEffect, useId, useRef } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: "md" | "xl";
}

export default function Modal({ title, onClose, children, actions, size = "xl" }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const node = dialog.current;
    const previous = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    return () => { node?.close(); document.body.style.overflow = previous; };
  }, []);

  return (
    <dialog ref={dialog} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onCloseRef.current(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className={`site-modal ${size === "md" ? "site-modal-compact" : "site-modal-wide"}`}>
      <div className="modal-shell flex min-h-0 flex-col overflow-hidden bg-card">
        <div className="modal-header flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-2">
          <h2 id={titleId} className="min-w-0 text-base font-medium text-foreground">{title}</h2>
          <div className="flex shrink-0 items-center gap-2">{actions}<button autoFocus type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-lg text-2xl text-muted hover:text-foreground" aria-label="Close">×</button></div>
        </div>
        <div className="modal-content min-h-0 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}
