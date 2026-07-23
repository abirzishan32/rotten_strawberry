import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';

/**
 * Counts up from 0 to `value` on mount with an easeOutCubic curve. Uses
 * requestAnimationFrame (not Reanimated) because animating the *text content* of
 * a number is far simpler and more reliable this way.
 */
export function AnimatedCounter({
  value,
  duration = 1300,
  className,
  suffix = '',
}: {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return (
    <Text className={className}>
      {display}
      {suffix}
    </Text>
  );
}
