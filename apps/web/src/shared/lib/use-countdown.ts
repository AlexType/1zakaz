import { useEffect, useState } from "react";

export function useCountdown(initialSeconds: number) {
  const [countdown, setCountdown] = useState(initialSeconds);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = window.setTimeout(
      () => setCountdown((seconds) => seconds - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [countdown]);

  return countdown;
}
