"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import QuotationShell from "@/components/quotations/QuotationShell";
import QuotationEditor from "@/components/quotations/QuotationEditor";
import { LoadingText } from "@/components/ui/AdminPageLayout";
import * as QuotationApi from "@/lib/quotationApi";
import type { Quotation } from "@/lib/quotations";
import { useRequirePortalUser } from "@/lib/useRequirePortalUser";

export default function EditQuotationPage() {
  useRequirePortalUser();
  return (
    <QuotationShell>
      <EditQuotation />
    </QuotationShell>
  );
}

function EditQuotation() {
  const id = useParams<{ id: string }>()?.id ?? "";
  const router = useRouter();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [quotation, setQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    QuotationApi.getQuotation(id)
      .then(({ quotation }) => {
        if (quotation.status !== "draft") {
          showToast(lang === "zh" ? "只能编辑草稿报价" : "Only draft quotations can be edited", "warning");
          router.replace(`/admin/quotations/${id}`);
          return;
        }
        setQuotation(quotation);
      })
      .catch(() => {
        showToast(lang === "zh" ? "未找到报价" : "Quotation not found", "error");
        router.replace("/admin/quotations");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!quotation) return <LoadingText>Loading...</LoadingText>;
  return <QuotationEditor quotation={quotation} />;
}
