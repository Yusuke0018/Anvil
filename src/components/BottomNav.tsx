'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/data/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 rpg-nav">
      <div className="mx-auto max-w-md flex">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 rpg-nav-item transition-colors
                ${isActive ? 'text-accent rpg-nav-item-active' : 'text-text-secondary'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs sm:text-[11px] mt-0.5 tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
