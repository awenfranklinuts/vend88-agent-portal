"use client";

import styled from "styled-components";

export type Period = "today" | "7d";

const Wrap = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background: #eef2f7;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
`;

const Pill = styled.div<{ $index: number }>`
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc(50% - 4px);
  border-radius: 8px;
  background: #1a237e;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${({ $index }) => ($index === 0 ? "0" : "calc(100% + 2px)")});
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
  color: ${({ $active }) => ($active ? "white" : "#5c6b7a")};

  &:hover {
    color: ${({ $active }) => ($active ? "white" : "#1a237e")};
  }
`;

interface PeriodToggleProps {
  period: Period;
  onChange: (period: Period) => void;
  todayLabel: string;
  sevenDayLabel: string;
}

export default function PeriodToggle({
  period,
  onChange,
  todayLabel,
  sevenDayLabel,
}: PeriodToggleProps) {
  return (
    <Wrap>
      <Pill $index={period === "today" ? 0 : 1} />
      <Button $active={period === "today"} onClick={() => onChange("today")}>
        {todayLabel}
      </Button>
      <Button $active={period === "7d"} onClick={() => onChange("7d")}>
        {sevenDayLabel}
      </Button>
    </Wrap>
  );
}
