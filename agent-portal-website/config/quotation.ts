/**
 * Details printed on quotation PDFs. Fill in the empty values before sending
 * quotes to customers — empty fields are left off the PDF.
 */
export const QUOTE_ISSUER = {
  /** Trading name, printed as text if the logo can't be loaded */
  name: "VendPOS",
  /** Registered entity the customer is contracting with (ABN Lookup) */
  legalName: "Vend88 Pty Ltd",
  logo: { src: "/images/vendpos-text-dark.png", aspectRatio: 815 / 176 },
  abn: "40 686 114 901",
  address: "10/191 Parramatta Rd, Auburn NSW 2144",
  email: "accounts@vend88.com",
  phone: "1300 726 825",
  website: "www.vendpos.com.au",
};

export const DEFAULT_VALID_DAYS = 30;

export const DEFAULT_QUOTE_TERMS = [
  "This quotation is valid until the date shown above.",
  "Hardware prices are one-off charges. Subscription charges are billed in advance for each billing period.",
  "Installation and training are scheduled after the quotation is accepted.",
].join("\n");
