'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Prefetch likely next pages based on current page
const PREFETCH_MAP: Record<string, string[]> = {
  '/admin': ['/admin/businesses', '/admin/customers', '/admin/agents'],
  '/admin/businesses': ['/admin/customers', '/admin/agents'],
  '/admin/customers': ['/admin/businesses', '/admin/agents'],
  '/admin/agents': ['/admin/businesses', '/admin/customers'],
  '/admin/reports': ['/admin/businesses', '/admin/customers'],
  '/admin/settings': ['/admin/businesses', '/admin/customers'],
};

export default function PrefetchLinks() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    
    // Prefetch likely next routes
    const routesToPrefetch = PREFETCH_MAP[pathname] || [];
    
    routesToPrefetch.forEach((route: string) => {
      // Create invisible link and trigger prefetch
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, [pathname]);

  return null;
}
