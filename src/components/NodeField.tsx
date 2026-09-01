import { useRef, useEffect } from "react";

interface NodeFieldProps {
  density?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function NodeField({ density = 1, className, style }: NodeFieldProps) {
  const cvsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cvsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: { x: number; y: number; vx: number; vy: number; r: number; accent: boolean }[] = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    const css = (v: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(v).trim();

    let cText = "27,26,23";
    let cAccent = "194,100,15";

    const hexToRgb = (h: string) => {
      h = h.replace("#", "");
      const n = parseInt(h, 16);
      return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
    };

    const readColors = () => {
      try {
        cText = hexToRgb(css("--text"));
        cAccent = hexToRgb(css("--accent"));
      } catch (_) {}
    };

    function resize() {
      const r = canvas!.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = W < 640;
      const base = small ? 26 : 52;
      const count = Math.round(base * density * Math.min(1.4, Math.max(0.7, W / 1100)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.8,
        accent: Math.random() < 0.12,
      }));
      readColors();
    }

    const LINK = () => (W < 640 ? 110 : 150);

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const link = LINK();

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < link) {
            const o = (1 - d / link) * 0.5;
            ctx.strokeStyle = `rgba(${cText},${o * 0.5})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        let near = false;
        if (mouse.active) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 170) {
            near = true;
            const f = (1 - d / 170) * 0.035;
            n.x += dx * f;
            n.y += dy * f;
            const o = 1 - d / 170;
            ctx.strokeStyle = `rgba(${cAccent},${o * 0.55})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }

        const acc = n.accent || near;
        ctx.fillStyle = acc
          ? `rgba(${cAccent},${near ? 0.95 : 0.75})`
          : `rgba(${cText},0.5)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + (near ? 1.2 : 0), 0, 7);
        ctx.fill();
      }
    }

    function still() {
      ctx.clearRect(0, 0, W, H);
      const link = LINK();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(${cText},${(1 - d / link) * 0.22})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.accent ? `rgba(${cAccent},0.75)` : `rgba(${cText},0.5)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 7);
        ctx.fill();
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = mouse.y = -9999;
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (ents) => { running = ents[0].isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onTheme = () => readColors();
    window.addEventListener("themechange", onTheme);

    if (reduce) {
      still();
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("themechange", onTheme);
    };
  }, [density]);

  return (
    <canvas
      ref={cvsRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      aria-hidden="true"
    />
  );
}
