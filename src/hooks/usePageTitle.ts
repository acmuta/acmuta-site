import { useEffect } from "react";

const SITE_NAME = "ACM at UTA";

export function usePageTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
