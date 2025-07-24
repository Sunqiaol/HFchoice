import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="HFChoice - Your premier marketplace for quality products and services" />
        <meta name="keywords" content="marketplace, products, services, ecommerce, shopping" />
        <meta name="author" content="HFChoice" />
        <meta name="robots" content="index, follow" />
        <meta name="google-site-verification" content="AcNykt7IIQ8FZy7xOuA_Ya-t4AxdXgRqKo1GMMBfdQ0" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HFChoice" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://hfchoice.onrender.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HFChoice",
              "url": "https://hfchoice.onrender.com",
              "description": "Your premier marketplace for quality products and services",
              "sameAs": []
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
