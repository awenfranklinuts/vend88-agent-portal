"use client";

import styled from "styled-components";

export type Period = "today" | "7d" | "30d" | "1y" | "all";

export interface PeriodOption {
  value: Period;
  label: string;
}

const TRACK_PAD = 3;
const GAP = 2;

const Wrap = styled.div<{ $count: number }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, 1fr);
  background: #eef2f7;
  border-radius: 10px;
  padding: ${TRACK_PAD}px;
  gap: ${GAP}px;
`;

// One track wide, slid across by whole tracks. A track is
// (100% - 2*pad - gap*(n-1)) / n, which folds into the percentage below; the
// transform is a percentage of the pill's own width, so it moves track + gap.
const Pill = styled.div<{ $index: number; $count: number }>`
  position: absolute;
  top: ${TRACK_PAD}px;
  bottom: ${TRACK_PAD}px;
  left: ${TRACK_PAD}px;
  width: calc(
    ${({ $count }) => 100 / $count}% -
      ${({ $count }) => (TRACK_PAD * 2 + GAP * ($count - 1)) / $count}px
  );
  border-radius: 8px;
  background: #1a237e;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(
    calc((100% + ${GAP}px) * ${({ $index }) => $index})
  );
`;

const Button = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  transition: color 0.2s ease;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "white" : "#5c6b7a")};

  &:hover {
    color: ${({ $active }) => ($active ? "white" : "#1a237e")};
  }
`;

interface PeriodToggleProps {
  period: Period;
  onChange: (period: Period) => void;
  options: PeriodOption[];
}

export default function PeriodToggle({ period, onChange, options }: PeriodToggleProps) {
  const activeIndex = Math.max(
    options.findIndex((o) => o.value === period),
    0
  );

  return (
    <Wrap $count={options.length}>
      <Pill $index={activeIndex} $count={options.length} />
      {options.map((option) => (
        <Button
          key={option.value}
          $active={option.value === period}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </Wrap>
  );
}
