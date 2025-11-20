"use client";

import React, { useContext, useState } from "react";

const isBrowser = typeof window !== "undefined";

export function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {
  const useEffect = isBrowser ? React.useLayoutEffect : React.useEffect;
  useEffect(effect, deps);
}

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
