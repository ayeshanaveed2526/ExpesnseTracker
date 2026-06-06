import { useEffect, useRef, useState } from 'react';

// Smoothly counts up/down from the previous value to the new one whenever
// `value` changes. Used for the Summary figures so additions "feel" alive.
const AnimatedNumber = ({ value = 0, duration = 750, format }) => {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) {
      setDisplay(to);
      return undefined;
    }

    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(from + (to - from) * eased);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value, duration]);

  const fmt =
    format || ((n) => n.toLocaleString('en-US', { maximumFractionDigits: 0 }));
  return <>{fmt(display)}</>;
};

export default AnimatedNumber;
