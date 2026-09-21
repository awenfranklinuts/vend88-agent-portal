import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" style={{background: 'linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%)', minHeight: '100vh'}}>
      <Head>
        {/*
          This app is a static export, so next.config's headers() never runs -
          the policy has to travel with the document. Everything the form needs
          is named: the backend it posts to (baked in at build time), and the
          Google font the layout pulls. frame-ancestors cannot be set through a
          meta tag, so clickjacking protection still has to come from the host's
          own header config (X-Frame-Options / CSP on the CDN).
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "img-src 'self' data: blob:",
            `connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dbapi.vend88.com'}`,
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; ')}
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <link rel="icon" href="/logos/registrationicon.png" />
        <link rel="apple-touch-icon" href="/logos/registrationicon.png" />
        <meta name="theme-color" content="#1a237e" />
        <meta name="description" content="VEND88 Onboarding Registration Form" />
        <title>VEND88 Onboarding Registration Form</title>
        <style dangerouslySetInnerHTML={{__html: `
          html, body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%);
            min-height: 100vh;
          }
        `}} />
      </Head>
      <body style={{margin: 0, padding: 0, background: 'linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%)', minHeight: '100vh'}}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
