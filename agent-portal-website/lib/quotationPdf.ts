/**
 * Builds a customer-facing quotation PDF with jsPDF.
 *
 * jsPDF's built-in fonts only cover Latin characters, so the PDF is English-only
 * and Chinese text typed into a quote will not print correctly.
 */

import { QUOTE_ISSUER } from "@/config/quotation";
import {
  type BillingPeriod,
  type Quotation,
  calculateTotals,
  displayNumber,
  formatMoney,
  lineSubtotal,
  toDisplayPrice,
} from "@/lib/quotations";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const NAVY: [number, number, number] = [10, 54, 85];
const GREY: [number, number, number] = [92, 107, 122];
const RULE: [number, number, number] = [224, 231, 239];

const GROUPS: { billing: BillingPeriod; title: string; suffix: string }[] = [
  { billing: "once", title: "One-off charges", suffix: "" },
  { billing: "monthly", title: "Monthly charges", suffix: " / month" },
  { billing: "yearly", title: "Yearly charges", suffix: " / year" },
];

const LOGO_HEIGHT = 9;

/** Fetches an image as a data URL for jsPDF; resolves null if it can't be loaded */
async function loadImageDataUrl(src: string): Promise<string | null> {
  try {
    const response = await fetch(src);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const formatDate = (iso: string) =>
  new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

export async function downloadQuotationPdf(quote: Quotation) {
  const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), loadImageDataUrl(QUOTE_ISSUER.logo.src)]);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const totals = calculateTotals(quote);
  const gstLabel = quote.pricesIncludeGst ? "inc GST" : "ex GST";
  let y = MARGIN;

  const setText = (size: number, colour = NAVY, style: "normal" | "bold" = "normal") => {
    doc.setFontSize(size);
    doc.setTextColor(...colour);
    doc.setFont("helvetica", style);
  };

  const ensureSpace = (height: number) => {
    if (y + height > PAGE_HEIGHT - MARGIN - 8) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const rule = () => {
    doc.setDrawColor(...RULE);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  };

  /* Header */
  let issuerTop: number;
  if (logo) {
    doc.addImage(logo, "PNG", MARGIN, y, LOGO_HEIGHT * QUOTE_ISSUER.logo.aspectRatio, LOGO_HEIGHT);
    issuerTop = y + LOGO_HEIGHT + 5;
  } else {
    setText(20, NAVY, "bold");
    doc.text(QUOTE_ISSUER.name, MARGIN, y + 6);
    issuerTop = y + 12;
  }
  setText(9, GREY);
  const issuerLines = [
    [QUOTE_ISSUER.legalName, QUOTE_ISSUER.abn && `ABN ${QUOTE_ISSUER.abn}`].filter(Boolean).join("  |  "),
    QUOTE_ISSUER.address,
    [QUOTE_ISSUER.phone, QUOTE_ISSUER.email].filter(Boolean).join("  |  "),
    QUOTE_ISSUER.website,
  ].filter(Boolean) as string[];
  issuerLines.forEach((line, i) => doc.text(line, MARGIN, issuerTop + i * 4.5));

  setText(18, NAVY, "bold");
  doc.text(quote.status === "draft" ? "DRAFT QUOTATION" : "QUOTATION", PAGE_WIDTH - MARGIN, y + 6, { align: "right" });
  setText(9, GREY);
  const metaLines = [
    `Quote no. ${displayNumber(quote)}`,
    `Date ${formatDate(quote.sentAt || quote.updatedAt)}`,
    `Valid until ${formatDate(quote.validUntil)}`,
  ];
  metaLines.forEach((line, i) => doc.text(line, PAGE_WIDTH - MARGIN, y + 12 + i * 4.5, { align: "right" }));

  y = Math.max(issuerTop + issuerLines.length * 4.5, y + 12 + metaLines.length * 4.5) + 6;
  rule();
  y += 8;

  /* Customer */
  setText(8, GREY, "bold");
  doc.text("PREPARED FOR", MARGIN, y);
  y += 5;
  const { customer } = quote;
  const customerLines = [
    customer.companyName,
    customer.contactName,
    customer.abn && `ABN ${customer.abn}`,
    [customer.address, customer.state].filter(Boolean).join(", "),
    [customer.email, customer.mobile].filter(Boolean).join("  |  "),
  ].filter(Boolean) as string[];
  customerLines.forEach((line, i) => {
    setText(i === 0 ? 11 : 9.5, i === 0 ? NAVY : GREY, i === 0 ? "bold" : "normal");
    doc.text(line, MARGIN, y);
    y += i === 0 ? 5.5 : 4.5;
  });
  y += 6;

  /* Item tables */
  const columns = {
    item: MARGIN,
    qty: MARGIN + CONTENT_WIDTH * 0.6,
    unit: MARGIN + CONTENT_WIDTH * 0.76,
    amount: PAGE_WIDTH - MARGIN,
  };
  const itemWidth = CONTENT_WIDTH * 0.5;

  for (const group of GROUPS) {
    const items = quote.items.filter(item => item.billing === group.billing);
    if (items.length === 0) continue;

    ensureSpace(30);
    setText(11, NAVY, "bold");
    doc.text(group.title, MARGIN, y);
    y += 6;

    setText(8, GREY, "bold");
    doc.text("ITEM", columns.item, y);
    doc.text("QTY", columns.qty, y, { align: "right" });
    doc.text(`UNIT (${gstLabel.toUpperCase()})`, columns.unit, y, { align: "right" });
    doc.text(`AMOUNT (${gstLabel.toUpperCase()})`, columns.amount, y, { align: "right" });
    y += 2.5;
    rule();
    y += 5;

    for (const item of items) {
      const nameLines: string[] = doc.splitTextToSize(item.name, itemWidth);
      const detail = [item.description, item.discountPercent > 0 && `${item.discountPercent}% discount`].filter(Boolean).join(" - ");
      const detailLines: string[] = detail ? doc.splitTextToSize(detail, itemWidth) : [];
      ensureSpace(nameLines.length * 4.5 + detailLines.length * 4 + 4);

      const rowTop = y;
      setText(9.5, NAVY);
      doc.text(nameLines, columns.item, y);
      doc.text(String(item.quantity), columns.qty, rowTop, { align: "right" });
      doc.text(formatMoney(toDisplayPrice(item.unitPrice, quote.pricesIncludeGst)), columns.unit, rowTop, { align: "right" });
      doc.text(formatMoney(toDisplayPrice(lineSubtotal(item), quote.pricesIncludeGst)), columns.amount, rowTop, { align: "right" });
      y += nameLines.length * 4.5;
      if (detailLines.length) {
        setText(8.5, GREY);
        doc.text(detailLines, columns.item, y);
        y += detailLines.length * 4;
      }
      y += 2.5;
    }

    /* Group totals */
    const t = totals[group.billing];
    const rows: [string, string, boolean][] = [
      ["Subtotal (ex GST)", formatMoney(t.subtotal), false],
      ...(t.quoteDiscount > 0 ? [[`Discount (${quote.discountPercent}%)`, `-${formatMoney(t.quoteDiscount)}`, false] as [string, string, boolean]] : []),
      ["GST (10%)", formatMoney(t.gst), false],
      [`Total (inc GST)`, `${formatMoney(t.total)}${group.suffix}`, true],
    ];
    ensureSpace(rows.length * 5.5 + 8);
    rule();
    y += 5;
    const labelX = MARGIN + CONTENT_WIDTH * 0.6;
    rows.forEach(([label, value, bold]) => {
      setText(bold ? 10.5 : 9.5, bold ? NAVY : GREY, bold ? "bold" : "normal");
      doc.text(label, labelX, y);
      doc.text(value, columns.amount, y, { align: "right" });
      y += 5.5;
    });
    y += 6;
  }

  /* Notes & terms */
  const textBlock = (title: string, body: string) => {
    if (!body.trim()) return;
    const lines: string[] = doc.splitTextToSize(body.trim(), CONTENT_WIDTH);
    ensureSpace(12);
    setText(8, GREY, "bold");
    doc.text(title, MARGIN, y);
    y += 5;
    setText(9, NAVY);
    lines.forEach(line => {
      ensureSpace(5);
      doc.text(line, MARGIN, y);
      y += 4.5;
    });
    y += 5;
  };
  textBlock("NOTES", quote.notes);
  textBlock("TERMS", quote.terms);

  /* Footer */
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    setText(8, GREY);
    doc.text(`${displayNumber(quote)}  |  Page ${page} of ${pages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: "center" });
  }

  doc.save(`${quote.number}${quote.version > 1 ? `-v${quote.version}` : ""}.pdf`);
}
