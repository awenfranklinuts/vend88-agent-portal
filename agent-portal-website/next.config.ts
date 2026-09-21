import type { NextConfig } from "next";

// Where the browser is allowed to send API calls. The portal talks to the
// backend directly (config/api.ts), so connect-src has to name it or every
// request is blocked - it is read from the same env var the client uses.
const apiOrigins = [process.env.NEXT_PUBLIC_API_BASE_URL, process.env.NEXT_PUBLIC_REGISTRATION_BASE_URL]
  .filter(Boolean)
  .map((url) => {
    try {
      return new URL(url as string).origin;
    } catch {
      return null;
    }
  })
  .filter(Boolean) as string[];

const isDev = process.env.NODE_ENV !== "production";

// Defaults cover the hosts config/api.ts falls back to when the env is unset,
// so a missing variable degrades to a working page rather than a blank one.
const connectSrc = [
  "'self'",
  ...new Set([...apiOrigins, "https://dbapi.vend88.com", "https://dev.vend88.com", "http://52.63.11.1:5000"]),
  ...(isDev ? ["ws:", "http://localhost:3001", "http://localhost:3999"] : []),
].join(" ");

// 'unsafe-inline' for styles is styled-components' injected <style> tags, and
// for scripts Next's own inline bootstrap; 'unsafe-eval' is only needed by the
// dev overlay. This is not a strict CSP - it is the one the app runs under
// today - but it still stops script from any other origin.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src ${connectSrc}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // frame-ancestors covers modern browsers; this is the belt for older ones.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Registration links carry a token in the query string, so referrers are
  // kept to the origin and never leak the full URL to another site.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
