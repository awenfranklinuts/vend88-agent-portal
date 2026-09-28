"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

// In-page section navigation for long detail pages (store, team): a sticky
// column of links beside the content that highlights where you are reading.
// Each section needs an element with a matching id and scroll-margin-top: 85px,
// so a jump lands below the fixed header rather than under it.

export const SectionLayout = styled.div`
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 2rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
`;

// Sticky so it stays with you down a long page; hidden on narrow screens,
// where the sections are already one on top of the other.
export const SectionNav = styled.nav`
  position: sticky;
  top: 85px;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  @media (max-width: 1100px) {
    display: none;
  }
`;

export const SectionNavItem = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border: none;
  border-left: 2px solid ${p => p.$active ? '#1273eb' : 'transparent'};
  background: ${p => p.$active ? 'rgba(18, 115, 235, 0.06)' : 'transparent'};
  color: ${p => p.$active ? '#1273eb' : '#5c6b7a'};
  font-size: 0.875rem;
  font-weight: ${p => p.$active ? '600' : '500'};
  text-align: left;
  cursor: pointer;
  border-radius: 0 4px 4px 0;

  &:hover {
    color: #1273eb;
    background: rgba(18, 115, 235, 0.06);
  }
`;

/**
 * Tracks which of `ids` is being read and scrolls to one on request.
 * `deps` should change whenever sections mount or unmount, so the observer
 * picks up elements that were not in the page on the first render.
 */
export function useSectionNav(ids: string[], enabled: boolean, deps: unknown[] = []) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!enabled) return;
    const seen = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio));
        // The topmost section that is actually on screen wins, so the highlight
        // follows reading position rather than whichever fired last.
        const visible = ids.filter((id) => (seen.get(id) || 0) > 0);
        if (visible.length) setActive(visible[0]);
      },
      { rootMargin: '-85px 0px -55% 0px', threshold: [0, 0.01] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ids.join(','), ...deps]);

  const goTo = (id: string) => {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    setActive(id);
  };

  return { active, goTo };
}
