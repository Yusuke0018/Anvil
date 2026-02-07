'use client';

import { type ReactNode, type TouchEvent, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_ITEMS } from '@/data/navigation';

const MIN_HORIZONTAL_SWIPE_PX = 64;
const MAX_VERTICAL_RATIO = 0.7;

type SwipeStart = {
  x: number;
  y: number;
  target: EventTarget | null;
};

function normalizePath(pathname: string): string {
  if (pathname === '/') return pathname;
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function shouldIgnoreTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'input, textarea, select, button, a, [role="button"], [data-no-swipe="true"]'
    )
  );
}

export default function SwipeNavigator({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const routes = useMemo(() => NAV_ITEMS.map((item) => item.href), []);
  const swipeStartRef = useRef<SwipeStart | null>(null);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      swipeStartRef.current = null;
      return;
    }

    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches) {
      swipeStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      target: event.target,
    };
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start || event.changedTouches.length !== 1) return;

    if (shouldIgnoreTarget(start.target)) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < MIN_HORIZONTAL_SWIPE_PX) return;
    if (Math.abs(deltaY) > Math.abs(deltaX) * MAX_VERTICAL_RATIO) return;

    const currentPath = normalizePath(pathname);
    const currentIndex = routes.findIndex((route) => route === currentPath);
    if (currentIndex === -1) return;

    const nextIndex =
      deltaX < 0
        ? (currentIndex + 1) % routes.length
        : (currentIndex - 1 + routes.length) % routes.length;

    router.push(routes[nextIndex]);
  };

  return (
    <div className="min-h-screen" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {children}
    </div>
  );
}
