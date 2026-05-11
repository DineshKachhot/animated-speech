import { useRef, useCallback } from 'react';
import type { Viseme } from '@/lib/visemes';

// Binary search: largest tMs <= positionMs
function findCurrentVisemeId(visemes: Viseme[], positionMs: number): number {
  if (visemes.length === 0) return 0;
  let lo = 0;
  let hi = visemes.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (visemes[mid].tMs <= positionMs) lo = mid;
    else hi = mid - 1;
  }
  return visemes[lo].tMs <= positionMs ? visemes[lo].id : 0;
}

// Polls audio position every 40ms and calls onViseme when id changes
export function useVisemeScheduler(onViseme: (id: number) => void) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(
    (visemes: Viseme[], getPositionMs: () => number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      let lastId = -1;
      timerRef.current = setInterval(() => {
        const id = findCurrentVisemeId(visemes, getPositionMs());
        if (id !== lastId) {
          lastId = id;
          onViseme(id);
        }
      }, 40);
    },
    [onViseme],
  );

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    onViseme(0);
  }, [onViseme]);

  return { start, stop };
}
