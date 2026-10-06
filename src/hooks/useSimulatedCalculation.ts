import { useCallback, useEffect, useRef, useState } from "react";

const SIMULATED_SERVER_DELAY_MS = 1000;

export function useSimulatedCalculation<T>() {
  const [result, setResult] = useState<T>();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const calculate = useCallback((compute: () => T) => {
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
    }
    setLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setResult(compute());
      setLoading(false);
      timeoutRef.current = undefined;
    }, SIMULATED_SERVER_DELAY_MS);
  }, []);

  return { result, loading, calculate };
}
