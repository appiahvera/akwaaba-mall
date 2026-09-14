import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { StoreProvider } from '@/lib/store'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Akwaaba Mall | Shop Ghana Online',
  description: 'Shop trusted Ghanaian vendors for fashion, beauty, electronics, groceries and everyday essentials with secure nationwide delivery.',
  generator: 'v0.app',
  metadataBase: new URL('https://akwaaba-mall.vercel.app'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Akwaaba Mall | Shop Ghana Online',
    description: 'Ghana’s everyday marketplace for trusted local vendors and nationwide delivery.',
    url: '/',
    images: [{ url: '/placeholder.svg?height=630&width=1200', width: 1200, height: 630, alt: 'Akwaaba Mall marketplace' }],
  },
  twitter: { card: 'summary_large_image', title: 'Akwaaba Mall | Shop Ghana Online', description: 'Ghana’s everyday marketplace for trusted local vendors.' },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
        <StoreProvider>{children}</StoreProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Akwaaba Mall', applicationCategory: 'ShoppingApplication', description: 'Ghanaian e-commerce marketplace for trusted local vendors.' }) }} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
