/** "5m ago" / "3h ago" / "2d ago" - falls back to a date past a week. */
export function formatRelativeTime(iso: string, lang: "en" | "zh"): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diff = Date.now() - then;
  if (diff < 60_000) return lang === "zh" ? "刚刚" : "just now";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return lang === "zh" ? `${minutes} 分钟前` : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return lang === "zh" ? `${hours} 小时前` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days <= 7) return lang === "zh" ? `${days} 天前` : `${days}d ago`;
  return new Date(then).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-AU");
}
