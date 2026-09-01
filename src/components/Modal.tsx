import { useEffect, type ReactNode } from "react";
import { XIcon } from "@/components/icons";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function Modal({ title, onClose, children, wide }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="pmodal-overlay" onClick={onClose}>
      <div
        className={`pmodal${wide ? " pmodal--wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="pmodal-head">
          <h3>{title}</h3>
          <button type="button" className="pmodal-x" onClick={onClose} aria-label="Close">
            <XIcon s={18} />
          </button>
        </div>
        <div className="pmodal-body">{children}</div>
      </div>
    </div>
  );
}
