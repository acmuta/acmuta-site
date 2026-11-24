import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  "a[href], button:not([disabled]), input:not([disabled]), " +
  "select:not([disabled]), textarea:not([disabled]), " +
  '[tabindex]:not([tabindex="-1"])';

interface UseFocusTrapOptions {
  onEscape?: () => void;
  // Extra elements placed at the front of the tab cycle, e.g. a close
  // control that lives outside the trapped container.
  include?: ReadonlyArray<RefObject<HTMLElement | null>>;
}

// Traps Tab/Shift+Tab inside `ref` while `active` and marks it inert while
// inactive, so a persistently-mounted overlay stays out of the tab order.
// Escape calls `onEscape`. On deactivate, focus returns to the element that
// opened the overlay. Sibling subtrees of the container's top-level host are
// made inert for the duration.
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  active: boolean,
  options: UseFocusTrapOptions = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (!active) {
      container.inert = true;
      return;
    }
    container.inert = false;
    const trigger = document.activeElement;

    const focusables = () => {
      const items = (optsRef.current.include ?? [])
        .map((r) => r.current)
        .filter((el): el is HTMLElement => !!el);
      items.push(
        ...Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
      );
      return items.filter((el) => el.getClientRects().length > 0);
    };

    const first = container.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? container).focus();

    let top: HTMLElement = container;
    while (top.parentElement && top.parentElement !== document.body) {
      top = top.parentElement;
    }
    const inerted: HTMLElement[] = [];
    for (const el of Array.from(document.body.children)) {
      if (el !== top && el instanceof HTMLElement) {
        el.inert = true;
        inerted.push(el);
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        optsRef.current.onEscape?.();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const idx = items.indexOf(document.activeElement as HTMLElement);
      let next: HTMLElement | undefined;
      if (idx === -1) next = e.shiftKey ? items[items.length - 1] : items[0];
      else if (e.shiftKey && idx === 0) next = items[items.length - 1];
      else if (!e.shiftKey && idx === items.length - 1) next = items[0];
      if (next) {
        e.preventDefault();
        next.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      for (const el of inerted) el.inert = false;
      container.inert = true;
      if (
        trigger instanceof HTMLElement &&
        trigger.isConnected &&
        (container.contains(document.activeElement) ||
          document.activeElement === document.body)
      ) {
        trigger.focus();
      }
    };
  }, [active]);

  return ref;
}
