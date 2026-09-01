import { useRef, useEffect, ElementType, ReactNode, CSSProperties } from "react";

export function useReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);

    const fallback = setTimeout(() => el.classList.add("in"), 2600);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return ref;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  gap?: number;
  as?: ElementType;
  style?: CSSProperties;
}

export function Reveal({
  children,
  className = "",
  stagger = false,
  gap = 70,
  as: Tag = "div",
  style,
}: RevealProps) {
  const ref = useReveal();

  useEffect(() => {
    if (stagger && ref.current) {
      [...ref.current.children].forEach((c, i) => {
        (c as HTMLElement).style.transitionDelay = `${i * gap}ms`;
      });
    }
  }, [stagger, gap, ref]);

  return (
    <Tag
      ref={ref}
      className={stagger ? className : `reveal ${className}`}
      data-stagger={stagger ? "" : undefined}
      style={style}
    >
      {children}
    </Tag>
  );
}
