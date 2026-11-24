import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@/components/icons";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function Modal({ title, onClose, children, wide }: ModalProps) {
  const titleId = useId();
  const dialogRef = useFocusTrap<HTMLDivElement>(true, { onEscape: onClose });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="pmodal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className={`pmodal${wide ? " pmodal--wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="pmodal-head">
          <h3 id={titleId}>{title}</h3>
          <button type="button" className="pmodal-x" onClick={onClose} aria-label="Close">
            <XIcon s={18} />
          </button>
        </div>
        <div className="pmodal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
