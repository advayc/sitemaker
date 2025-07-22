import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Website Generator | Create Professional Portfolios",
  description: "Generate a modern, responsive personal website from your resume. Build professional portfolios with AI-powered design and customizable templates.",
  keywords: ["personal website", "portfolio generator", "resume website", "professional portfolio", "website builder", "personal branding"],
  authors: [{ name: "SiteMaker" }],
  creator: "SiteMaker",
  publisher: "SiteMaker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://sitemaker-beta.vercel.app/' || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Personal Website Generator | Create Professional Portfolios",
    description: "Generate a modern, responsive personal website from your resume. Build professional portfolios with AI-powered design and customizable templates.",
    url: "/",
    siteName: "SiteMaker",
    images: [
      {
        url: "/banner.png",
        width: 1920,
        height: 1080,
        alt: "SiteMaker - Personal Website Generator Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Website Generator | Create Professional Portfolios",
    description: "Generate a modern, responsive personal website from your resume. Build professional portfolios with AI-powered design and customizable templates.",
    images: ["/banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  themeColor: '#000000',
  verification: {
  },
  icons: {
    icon: '/pc.svg',
    apple: '/pc.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || 'https://sitemaker-beta.vercel.app/' ||'http://localhost:3000'} />
      </head>
      <body className={inter.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SiteMaker - Personal Website Generator",
              "description": "Generate a modern, responsive personal website from your resume. Build professional portfolios with AI-powered design and customizable templates.",
              "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://sitemaker-beta.vercel.app/' || 'http://localhost:3000',
              "applicationCategory": "WebApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "SiteMaker"
              }
            })
          }}
        />
      </body>
    </html>
  )
}