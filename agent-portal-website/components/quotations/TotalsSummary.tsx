"use client";

import { useLanguage } from "@/context/LanguageContext";
import { type BillingPeriod, type QuotationTotals, formatMoney } from "@/lib/quotations";
import { TotalsTable } from "./ui";

const GROUPS: { billing: BillingPeriod; title: { en: string; zh: string }; suffix: { en: string; zh: string } }[] = [
  { billing: "once", title: { en: "One-off charges", zh: "一次性费用" }, suffix: { en: "", zh: "" } },
  { billing: "monthly", title: { en: "Monthly charges", zh: "每月费用" }, suffix: { en: " / month", zh: " / 月" } },
  { billing: "yearly", title: { en: "Yearly charges", zh: "每年费用" }, suffix: { en: " / year", zh: " / 年" } },
];

/** One totals block per billing period that has items, so one-off and recurring amounts are never added together */
export default function TotalsSummary({ totals, hasItems }: { totals: QuotationTotals; hasItems: (billing: BillingPeriod) => boolean }) {
  const { lang } = useLanguage();
  const visible = GROUPS.filter(g => hasItems(g.billing));

  if (visible.length === 0) {
    return <p style={{ color: "#5c6b7a" }}>{lang === "zh" ? "添加项目后显示合计。" : "Add items to see totals."}</p>;
  }

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      {visible.map(({ billing, title, suffix }) => {
        const t = totals[billing];
        return (
          <div key={billing}>
            <strong style={{ color: "#0a3655", fontSize: "0.875rem" }}>{title[lang]}</strong>
            <TotalsTable>
              <tbody>
                <tr className="muted">
                  <td>{lang === "zh" ? "小计（不含GST）" : "Subtotal (ex GST)"}</td>
                  <td>{formatMoney(t.subtotal)}</td>
                </tr>
                {t.quoteDiscount > 0 && (
                  <tr className="muted">
                    <td>{lang === "zh" ? "报价折扣" : "Quote discount"}</td>
                    <td>−{formatMoney(t.quoteDiscount)}</td>
                  </tr>
                )}
                <tr className="muted">
                  <td>GST (10%)</td>
                  <td>{formatMoney(t.gst)}</td>
                </tr>
                <tr className="total">
                  <td>{lang === "zh" ? "总计（含GST）" : "Total (inc GST)"}</td>
                  <td>{formatMoney(t.total)}{suffix[lang]}</td>
                </tr>
              </tbody>
            </TotalsTable>
          </div>
        );
      })}
    </div>
  );
}
