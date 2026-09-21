/**
 * CSV export helpers.
 *
 * Two things every export here has to get right:
 *
 * 1. Quoting. A value containing a quote, comma or newline has to be wrapped and
 *    its quotes doubled, or the row silently splits into the wrong columns -
 *    `Bob "The Builder" Smith` is an ordinary customer name, not an edge case.
 *
 * 2. Formula injection. Excel, Sheets and Numbers execute a cell that starts
 *    with = + - @ (or a leading tab/CR). Much of what the portal exports came
 *    from a public registration form, so the text is attacker-controlled; the
 *    cell is prefixed with a single quote, which spreadsheets strip on display.
 */

const RISKY_FIRST_CHAR = /^[=+\-@\t\r]/;

function escapeCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  const safe = RISKY_FIRST_CHAR.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** Rows keyed by column header, in the order the first row lists them. */
export function toCsv(rows: Record<string, unknown>[]): string {
  const headers = Object.keys(rows[0] ?? {});
  return [
    headers.map(escapeCell).join(","),
    ...rows.map(row => headers.map(header => escapeCell(row[header])).join(",")),
  ].join("\n");
}

/**
 * Hands the browser a CSV file. The object URL is revoked once the click is
 * through - each export used to leak its blob for the life of the tab.
 * A BOM is prepended so Excel reads the UTF-8 (names, 中文) correctly.
 */
export function downloadCsv(filename: string, rows: Record<string, unknown>[]): void {
  const blob = new Blob([`﻿${toCsv(rows)}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
