"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

export type Granularity = "day" | "hour";

export interface ChartBucket {
  date: string;
  value: number;
}

const CHART_HEIGHT = 320;
// Generous top padding leaves room for the value pill above the highest point;
// the baseline sits close to the bottom so the x-labels tuck under it.
const CHART_PAD_TOP = 36;
const CHART_PAD_BOTTOM = 12;
const CHART_PAD_X = 10;
const USABLE_HEIGHT = CHART_HEIGHT - CHART_PAD_TOP - CHART_PAD_BOTTOM;
const Y_AXIS_W = 56;

const InspectorBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f5f7fa;
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  margin-top: 1.25rem;
`;

const InspectorHint = styled.span`
  font-size: 0.8125rem;
  color: #9aa7b5;
`;

const InspectorDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1a237e;
  flex-shrink: 0;
`;

const InspectorLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0a3655;
`;

const InspectorValue = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0a3655;
`;

const InspectorMeta = styled.span`
  font-size: 0.75rem;
  color: #8a94a3;
  margin-left: auto;
`;

const ChartRow = styled.div`
  display: flex;
  margin-top: 1.5rem;
`;

const YAxis = styled.div<{ $dimmed: boolean }>`
  position: relative;
  width: ${Y_AXIS_W}px;
  height: ${CHART_HEIGHT}px;
  flex-shrink: 0;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.4 : 1)};
  transition: opacity 0.2s ease;
`;

const YTick = styled.div<{ $top: number }>`
  position: absolute;
  left: 0;
  right: 8px;
  top: ${({ $top }) => $top}px;
  transform: translateY(-50%);
  text-align: right;
  font-size: 0.6875rem;
  color: #9aa7b5;
`;

const ChartWrap = styled.div<{ $dimmed: boolean }>`
  position: relative;
  flex: 1;
  min-width: 0;
  height: ${CHART_HEIGHT}px;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.4 : 1)};
  transition: opacity 0.2s ease;
`;

const ChartSvg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const CrosshairLine = styled.line`
  stroke: #c3ccd6;
  stroke-width: 1;
  stroke-dasharray: 3 3;
`;

const EndValueLabel = styled.div<{ $left: number; $top: number }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: ${({ $top }) => $top}px;
  transform: translate(-50%, -180%);
  font-size: 0.75rem;
  font-weight: 700;
  color: #0a3655;
  white-space: nowrap;
  pointer-events: none;
`;

const Tooltip = styled.div<{ $left: number; $top: number }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: ${({ $top }) => $top}px;
  transform: translate(-50%, calc(-100% - 12px));
  background: #0a3655;
  color: white;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  font-size: 0.75rem;
  line-height: 1.3;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(10, 54, 85, 0.25);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #0a3655;
  }
`;

const TooltipValue = styled.div`
  font-weight: 700;
`;

const TooltipDate = styled.div`
  opacity: 0.75;
  font-size: 0.6875rem;
`;

const AxisRow = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const AxisSpacer = styled.div`
  width: ${Y_AXIS_W}px;
  flex-shrink: 0;
`;

const AxisLabels = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
`;

const AxisLabel = styled.div`
  flex: 1;
  text-align: center;
  font-size: 0.6875rem;
  color: #9aa7b5;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1rem;
  padding-left: ${Y_AXIS_W}px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #8a94a3;
`;

const LegendSwatch = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: linear-gradient(135deg, #00c2e0, #1a237e);
`;

const LegendDashLine = styled.div`
  width: 16px;
  height: 0;
  border-top: 1.5px dashed #9aa7b5;
`;

function formatDayLabel(dateStr: string, lang: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

// Hour buckets come back as a naive local timestamp ("...T14:00:00") already
// shifted to the shop's timezone, so the hour is read directly off the string
// rather than through a Date - going through Date would re-apply the
// viewer's own timezone and shift the label.
function formatHourLabel(dateStr: string): string {
  const match = dateStr.match(/T(\d{2}):/);
  if (!match) return "";
  const hour24 = parseInt(match[1], 10);
  const suffix = hour24 < 12 ? "am" : "pm";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}${suffix}`;
}

export function formatChartLabel(
  dateStr: string,
  granularity: Granularity,
  lang: string
): string {
  return granularity === "hour" ? formatHourLabel(dateStr) : formatDayLabel(dateStr, lang);
}

// Hourly charts can carry up to 24 points - showing every tick crowds the
// axis, so only a spaced-out subset (plus the last one) gets a label.
function shouldShowAxisLabel(index: number, count: number, granularity: Granularity): boolean {
  if (granularity === "day" || count <= 8) return true;
  const step = Math.ceil(count / 6);
  return index % step === 0 || index === count - 1;
}

// Picks a round step (1/2/2.5/5/10 x a power of ten) so the y-axis reads
// 0 / 25 / 50 / 75 / 100 instead of raw data-driven fractions.
function niceTickStep(rawMax: number): number {
  if (!isFinite(rawMax) || rawMax <= 0) return 1;
  const target = rawMax / 4;
  const exp = Math.floor(Math.log10(target));
  const pow = Math.pow(10, exp);
  const norm = target / pow;
  let nice: number;
  if (norm <= 1) nice = 1;
  else if (norm <= 2) nice = 2;
  else if (norm <= 2.5) nice = 2.5;
  else if (norm <= 5) nice = 5;
  else nice = 10;
  return nice * pow;
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  date: string;
}

function buildPoints(data: ChartBucket[], niceMax: number, width: number): ChartPoint[] {
  const n = data.length;
  if (n === 0 || width <= 0) return [];
  const usableWidth = width - CHART_PAD_X * 2;
  return data.map((d, i) => {
    const x = n === 1 ? width / 2 : CHART_PAD_X + (usableWidth * i) / (n - 1);
    // A revenue bucket can net negative when refunds outweigh sales; the plot
    // floors it at the baseline so nothing draws outside the box, and the
    // tooltip still reports the true signed value.
    const ratio = niceMax > 0 ? Math.max(d.value, 0) / niceMax : 0;
    const y = CHART_PAD_TOP + USABLE_HEIGHT * (1 - ratio);
    return { x, y, value: d.value, date: d.date };
  });
}

// Catmull-Rom -> cubic Bezier with adaptive tension: a segment next to a sharp
// peak or valley shrinks toward a straight line instead of bowing past the
// data point, so a single-hour spike still reads as a sharp spike.
function buildSmoothPath(points: ChartPoint[], yMin: number, yMax: number): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  const baseT = 0.5;
  const clampY = (y: number) => Math.max(yMin, Math.min(yMax, y));
  const segs: string[] = [`M ${points[0].x},${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const segHeight = Math.abs(p2.y - p1.y);
    const adjacentSpread = Math.max(Math.abs(p1.y - p0.y), Math.abs(p3.y - p2.y), segHeight);
    const ratio = adjacentSpread > 0 ? segHeight / adjacentSpread : 0;
    const t = baseT * (1 - 0.6 * Math.min(1, ratio));
    const c1x = p1.x + ((p2.x - p0.x) / 6) * t * 2;
    const c1y = clampY(p1.y + ((p2.y - p0.y) / 6) * t * 2);
    const c2x = p2.x - ((p3.x - p1.x) / 6) * t * 2;
    const c2y = clampY(p2.y - ((p3.y - p1.y) / 6) * t * 2);
    segs.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`);
  }
  return segs.join(" ");
}

function buildAreaPath(linePath: string, points: ChartPoint[]): string {
  if (points.length === 0) return "";
  const baseline = CHART_HEIGHT - CHART_PAD_BOTTOM;
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath} L ${last.x},${baseline} L ${first.x},${baseline} Z`;
}

interface Props {
  data: ChartBucket[];
  granularity: Granularity;
  /** Headline total for the period, used for the "% of total" readout. */
  total: number;
  dimmed: boolean;
  lang: string;
  seriesLabel: string;
  /** Full-precision formatter for the tooltip, inspector and end label. */
  formatValue: (n: number) => string;
  /** Compact formatter for the y-axis ticks. */
  formatAxisValue: (n: number) => string;
  /** Placeholder column count while the first fetch is in flight. */
  skeletonCount: number;
  /** Unique per instance - SVG gradient ids are document-global. */
  gradientId: string;
}

export default function SummaryLineChart({
  data,
  granularity,
  total,
  dimmed,
  lang,
  seriesLabel,
  formatValue,
  formatAxisValue,
  skeletonCount,
  gradientId,
}: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // The plot is drawn in real pixels rather than a fixed viewBox scaled to fit:
  // stretching a viewBox to a much wider container distorts the geometry
  // (round dots become ovals, stroke widths go uneven).
  const [plotWidth, setPlotWidth] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setPlotWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maxValue = data.length ? Math.max(...data.map((d) => d.value), 1) : 1;
  const tickStep = niceTickStep(maxValue);
  const niceMax = Math.max(tickStep * 4, maxValue);
  const ticks = [4, 3, 2, 1, 0].map((m) => tickStep * m);

  const activeBuckets = data.filter((d) => d.value > 0).length;
  const sum = data.reduce((a, d) => a + d.value, 0);
  const avg = activeBuckets > 0 ? sum / activeBuckets : data.length > 0 ? sum / data.length : 0;
  const avgY = avg > 0 && avg <= niceMax ? CHART_PAD_TOP + USABLE_HEIGHT * (1 - avg / niceMax) : null;

  const points = useMemo(
    () => buildPoints(data, niceMax, plotWidth),
    [data, niceMax, plotWidth]
  );
  const linePath = useMemo(
    () => buildSmoothPath(points, CHART_PAD_TOP, CHART_HEIGHT - CHART_PAD_BOTTOM),
    [points]
  );
  const areaPath = useMemo(() => buildAreaPath(linePath, points), [linePath, points]);

  const handlePointerMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const index = Math.round(relX * (points.length - 1));
    setHoverIndex(Math.min(Math.max(index, 0), points.length - 1));
  };

  const handlePointerLeave = () => setHoverIndex(null);

  const lastIndex = points.length ? points.length - 1 : null;
  const activeIndex = hoverIndex ?? lastIndex;
  const activePoint = activeIndex !== null ? points[activeIndex] : null;
  const activeLeft = activePoint ? activePoint.x : 0;
  const isHovering = hoverIndex !== null;
  const activeShare = activePoint && total > 0 ? (activePoint.value / total) * 100 : 0;

  const skeleton = Array(skeletonCount).fill(null);
  const lineGradient = `${gradientId}-line`;
  const areaGradient = `${gradientId}-area`;

  return (
    <>
      <InspectorBar>
        {isHovering && activePoint ? (
          <>
            <InspectorDot />
            <InspectorLabel>{formatChartLabel(activePoint.date, granularity, lang)}</InspectorLabel>
            <InspectorValue>{formatValue(activePoint.value)}</InspectorValue>
            <InspectorMeta>
              {lang === "zh"
                ? `占总数 ${activeShare.toFixed(1)}%`
                : `${activeShare.toFixed(1)}% of total`}
            </InspectorMeta>
          </>
        ) : (
          <InspectorHint>
            {lang === "zh" ? "将鼠标悬停在数据点上查看详情" : "Hover a point to inspect"}
          </InspectorHint>
        )}
      </InspectorBar>

      <ChartRow>
        <YAxis $dimmed={dimmed}>
          {ticks.map((v, i) => {
            const top = CHART_PAD_TOP + (ticks.length > 1 ? (i / (ticks.length - 1)) * USABLE_HEIGHT : 0);
            return (
              <YTick key={i} $top={top}>
                {formatAxisValue(v)}
              </YTick>
            );
          })}
        </YAxis>

        <ChartWrap ref={wrapRef} $dimmed={dimmed}>
          {points.length > 0 && (
            <ChartSvg
              ref={svgRef}
              viewBox={`0 0 ${plotWidth} ${CHART_HEIGHT}`}
              onMouseMove={handlePointerMove}
              onMouseLeave={handlePointerLeave}
            >
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

              {ticks.map((_, i) => {
                const y = CHART_PAD_TOP + (ticks.length > 1 ? (i / (ticks.length - 1)) * USABLE_HEIGHT : 0);
                return (
                  <line
                    key={i}
                    x1={CHART_PAD_X}
                    y1={y}
                    x2={plotWidth - CHART_PAD_X}
                    y2={y}
                    stroke="#eef1f5"
                    strokeWidth={1}
                  />
                );
              })}

              <path d={areaPath} fill={`url(#${areaGradient})`} stroke="none" />
              <path
                d={linePath}
                fill="none"
                stroke={`url(#${lineGradient})`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((p, i) => {
                if (i === activeIndex) return null;
                const isZero = p.value <= 0;
                return (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={2.5}
                    fill={isZero ? "white" : "#1a237e"}
                    stroke={isZero ? "#c3ccd6" : "#1a237e"}
                    strokeWidth={1}
                    opacity={isZero ? 0.6 : 0.85}
                  />
                );
              })}

              {isHovering && activePoint && (
                <CrosshairLine
                  x1={activePoint.x}
                  y1={CHART_PAD_TOP}
                  x2={activePoint.x}
                  y2={CHART_HEIGHT - CHART_PAD_BOTTOM}
                />
              )}

              {avgY !== null && (
                <line
                  x1={CHART_PAD_X}
                  y1={avgY}
                  x2={plotWidth - CHART_PAD_X}
                  y2={avgY}
                  stroke="#9aa7b5"
                  strokeWidth={1.25}
                  strokeDasharray="5 4"
                  opacity={0.85}
                />
              )}

              {activePoint && (
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r={5}
                  fill="#1a237e"
                  stroke="white"
                  strokeWidth={2}
                />
              )}
            </ChartSvg>
          )}

          {activePoint && isHovering && (
            <Tooltip $left={activeLeft} $top={activePoint.y}>
              <TooltipValue>{formatValue(activePoint.value)}</TooltipValue>
              <TooltipDate>{formatChartLabel(activePoint.date, granularity, lang)}</TooltipDate>
            </Tooltip>
          )}

          {activePoint && !isHovering && (
            <EndValueLabel $left={activeLeft} $top={activePoint.y}>
              {formatValue(activePoint.value)}
            </EndValueLabel>
          )}
        </ChartWrap>
      </ChartRow>

      <AxisRow>
        <AxisSpacer />
        <AxisLabels>
          {(data.length ? data : skeleton).map((d: ChartBucket | null, i, arr) => (
            <AxisLabel key={d?.date ?? i}>
              {d && shouldShowAxisLabel(i, arr.length, granularity)
                ? formatChartLabel(d.date, granularity, lang)
                : ""}
            </AxisLabel>
          ))}
        </AxisLabels>
      </AxisRow>

      <LegendRow>
        <LegendItem>
          <LegendSwatch />
          <span>{seriesLabel}</span>
        </LegendItem>
        <LegendItem>
          <LegendDashLine />
          <span>{lang === "zh" ? "平均值" : "Average"}</span>
        </LegendItem>
      </LegendRow>
    </>
  );
}
