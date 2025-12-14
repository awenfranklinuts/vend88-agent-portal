import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" style={{background: 'linear-gradient(135deg, #e0e7ef 0%, #f7faff 100%)', minHeight: '100vh'}}>
      <Head>
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
