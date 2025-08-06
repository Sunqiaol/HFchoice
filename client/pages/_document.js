import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta name='description' content='HF Choice (HungFa) - Premier marketplace for quality products and services. Find everything you need at HF Choice - your trusted partner for all your needs.' />
        <meta name='keywords' content='HF Choice, HFChoice, hungfa, hfchoice, hf choice, marketplace, products, services, ecommerce, shopping, online store, quality products, trusted marketplace' />
        <meta name='author' content='HF Choice' />
        <meta name='robots' content='index, follow' />
        <meta name='google-site-verification' content='AcNykt7IIQ8FZy7xOuA_Ya-t4AxdXgRqKo1GMMBfdQ0' />
        <meta property='og:title' content='HF Choice - Premier Marketplace | Quality Products & Services' />
        <meta property='og:description' content='HF Choice (HungFa) - Premier marketplace for quality products and services. Find everything you need at HF Choice.' />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='HF Choice' />
        <meta property='og:url' content='https://hfchoice.onrender.com' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='HF Choice - Premier Marketplace' />
        <meta name='twitter:description' content='HF Choice (HungFa) - Premier marketplace for quality products and services.' />
        <link rel='canonical' href='https://hfchoice.onrender.com' />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              'name': 'HF Choice (HungFa)',
              'url': 'https://hfchoice.onrender.com',
              'description': 'HF Choice (HungFa) - Premier marketplace for quality products and services. Your trusted partner for quality products and exceptional service.',
              'sameAs': []
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
