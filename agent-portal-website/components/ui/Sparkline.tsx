"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { formatChartLabel, Granularity, ChartBucket } from "./SummaryLineChart";

// A stripped-back cousin of SummaryLineChart for the dashboard summary tiles: the
// same line and area gradient so the two read as one family, but no axes, ticks,
// gridlines, legend or average rule - just the shape of the period, with a hover
// readout so the plot is still inspectable.
// The area is filled, so the scale is anchored at zero rather than at the series
// minimum - truncating it would overstate the swing. Height buys back the shape
// legibility that a zero baseline costs on a wide tile.
const HEIGHT = 84;
const PAD_TOP = 10;
const PAD_BOTTOM = 4;
const PAD_X = 3;
const USABLE = HEIGHT - PAD_TOP - PAD_BOTTOM;

const Wrap = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  height: ${HEIGHT}px;
  margin-top: 0.5rem;
`;

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const Tooltip = styled.div<{ $left: number }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: 0;
  transform: translate(-50%, -100%);
  background: #0a3655;
  color: white;
  padding: 0.3rem 0.55rem;
  border-radius: 8px;
  font-size: 0.6875rem;
  line-height: 1.35;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(10, 54, 85, 0.25);
  z-index: 2;
`;

const TooltipValue = styled.div`
  font-weight: 700;
`;

const TooltipDate = styled.div`
  opacity: 0.75;
`;

interface Point {
  x: number;
  y: number;
  value: number;
  date: string;
}

function buildPoints(data: ChartBucket[], max: number, width: number): Point[] {
  const n = data.length;
  if (n === 0 || width <= 0) return [];
  const usableWidth = width - PAD_X * 2;
  return data.map((d, i) => {
    const x = n === 1 ? width / 2 : PAD_X + (usableWidth * i) / (n - 1);
    // Revenue nets negative when refunds outweigh sales; the plot floors at the
    // baseline so nothing draws outside the box, and the tooltip still reports
    // the true signed value.
    const ratio = max > 0 ? Math.max(d.value, 0) / max : 0;
    return { x, y: PAD_TOP + USABLE * (1 - ratio), value: d.value, date: d.date };
  });
}

// Catmull-Rom -> cubic Bezier, clamped to the plot box so a curve never bows past
// the baseline or the top edge.
function buildPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  const clamp = (y: number) => Math.max(PAD_TOP, Math.min(HEIGHT - PAD_BOTTOM, y));
  const segs: string[] = [`M ${points[0].x},${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = clamp(p1.y + (p2.y - p0.y) / 6);
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = clamp(p2.y - (p3.y - p1.y) / 6);
    segs.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`);
  }
  return segs.join(" ");
}

interface Props {
  data: ChartBucket[];
  granularity: Granularity;
  lang: string;
  formatValue: (n: number) => string;
  /** Unique per instance - SVG gradient ids are document-global. */
  gradientId: string;
}

export default function Sparkline({
  data,
  granularity,
  lang,
  formatValue,
  gradientId,
}: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Drawn in real pixels rather than a scaled viewBox: stretching a viewBox to a
  // much wider container distorts the geometry (round dots become ovals).
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const max = data.length ? Math.max(...data.map((d) => d.value), 1) : 1;
  const points = useMemo(() => buildPoints(data, max, width), [data, max, width]);
  const linePath = useMemo(() => buildPath(points), [points]);
  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const baseline = HEIGHT - PAD_BOTTOM;
    const last = points[points.length - 1];
    const first = points[0];
    return `${linePath} L ${last.x},${baseline} L ${first.x},${baseline} Z`;
  }, [linePath, points]);

  const handleMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const index = Math.round(relX * (points.length - 1));
    setHoverIndex(Math.min(Math.max(index, 0), points.length - 1));
  };

  if (points.length === 0) return <Wrap ref={wrapRef} />;

  const active = hoverIndex !== null ? points[hoverIndex] : null;
  const lineGradient = `${gradientId}-line`;
  const areaGradient = `${gradientId}-area`;

  return (
    <Wrap
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <Svg viewBox={`0 0 ${width} ${HEIGHT}`}>
        <defs>
          <linearGradient id={lineGradient} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00c2e0" />
            <stop offset="100%" stopColor="#1a237e" />
          </linearGradient>
          <linearGradient id={areaGradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a237e" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#1a237e" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill={`url(#${areaGradient})`} stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke={`url(#${lineGradient})`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {active && (
          <>
            <line
              x1={active.x}
              y1={PAD_TOP}
              x2={active.x}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="#c3ccd6"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={active.x}
              cy={active.y}
              r={4.5}
              fill="#1a237e"
              stroke="white"
              strokeWidth={2}
            />
          </>
        )}
      </Svg>

      {active && (
        <Tooltip $left={active.x}>
          <TooltipValue>{formatValue(active.value)}</TooltipValue>
          <TooltipDate>{formatChartLabel(active.date, granularity, lang)}</TooltipDate>
        </Tooltip>
      )}
    </Wrap>
  );
}
