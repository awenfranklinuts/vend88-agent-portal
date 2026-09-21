"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuotationShell from "@/components/quotations/QuotationShell";
import QuotationEditor from "@/components/quotations/QuotationEditor";
import { useRequirePortalUser } from "@/lib/useRequirePortalUser";

export default function NewQuotationPage() {
  useRequirePortalUser();
  return (
    <QuotationShell>
      <Suspense>
        <NewQuotation />
      </Suspense>
    </QuotationShell>
  );
}

/** Accepts ?inquiryId=&contactName=&companyName=&email=&mobile=&state= to prefill from an inquiry */
function NewQuotation() {
  const params = useSearchParams();
  const get = (key: string) => params?.get(key) || undefined;

  return (
    <QuotationEditor
      prefill={{
        inquiryId: get("inquiryId"),
        customer: {
          contactName: get("contactName"),
          companyName: get("companyName"),
          email: get("email"),
          mobile: get("mobile"),
          state: get("state"),
        },
      }}
    />
  );
}
