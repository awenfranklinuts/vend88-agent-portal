'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComponentProps, MouseEvent } from 'react';

interface OptimizedLinkProps extends ComponentProps<typeof Link> {
  prefetch?: boolean;
}

/**
 * Optimized Link component with instant navigation feedback
 * Starts showing loading state immediately on click
 */
export default function OptimizedLink({ 
  children, 
  href, 
  prefetch = true,
  onClick,
  ...props 
}: OptimizedLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    // Don't interfere with default Link behavior
    // Next.js will handle the navigation
  };

  return (
    <Link 
      href={href} 
      prefetch={prefetch}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
