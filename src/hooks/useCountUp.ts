import { useEffect, useRef, useState } from 'react';

/**
 * Counts a number up from 0 on mount. The target lives in a ref so the
 * interval callback never reads a stale state value.
 */
export function useCountUp(target: number, duration: number = 520, steps: number = 24) {
  const [value, setValue] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    let frame = 0;
    setValue(0);
    const id = setInterval(() => {
      frame += 1;
      const t = Math.min(1, frame / steps);
      // ease-out so the last steps settle instead of snapping
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(targetRef.current * eased);
      if (t >= 1) {
        clearInterval(id);
      }
    }, Math.max(16, Math.round(duration / steps)));

    return () => clearInterval(id);
  }, [duration, steps, target]);

  return value;
}

export default useCountUp;
