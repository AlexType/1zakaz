"use client";

import { useEffect } from "react";

export function useUnsavedChanges(hasChanges: boolean) {
  useEffect(() => {
    if (!hasChanges) return;

    const preventWindowClose = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", preventWindowClose);
    return () => window.removeEventListener("beforeunload", preventWindowClose);
  }, [hasChanges]);
}
