'use client';

import { SWRConfig } from 'swr';
import { swrConfig } from '@/lib/swr-config';
import { ReactNode } from 'react';

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
}
