import { useCallback, useEffect, useRef, useState } from 'react';

/** Burn-test stopwatch. The interval id lives in a ref, never in state. */
export function useBurnTimer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running) {
      stop();
      return;
    }
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return stop;
  }, [running, stop]);

  // Safety net: clear the interval if the screen unmounts mid-test.
  useEffect(() => stop, [stop]);

  const toggle = useCallback(() => setRunning(prev => !prev), []);

  const reset = useCallback(() => {
    setRunning(false);
    setSeconds(0);
  }, []);

  return { running, seconds, toggle, reset };
}

export default useBurnTimer;
