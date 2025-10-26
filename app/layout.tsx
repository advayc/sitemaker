import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { WebVitals } from "@/components/web-vitals"

export const metadata: Metadata = {
  title: {
    default: "Personal Website Generator | Create Professional Portfolios",
    template: "%s | SiteMaker"
  },
  description: "Generate a modern, responsive personal website from your resume. Build professional portfolios with AI-powered design and customizable templates.",
  keywords: [
    "personal website", "portfolio generator", "resume website", 
    "professional portfolio", "website builder", "personal branding",
    "AI-powered design", "responsive design", "portfolio templates",
    "professional website", "online portfolio", "resume to website",
    "portfolio maker", "website generator", "professional branding"
  ],
  authors: [{ name: "SiteMaker", url: "https://sitemaker.advay.ca" }],
  creator: "SiteMaker",
  publisher: "SiteMaker",
  applicationName: "SiteMaker",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://sitemaker.advay.ca' || "http://localhost:3000"),
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
    creator: "@sitemaker",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
    other: {
      "msvalidate.01": "",
    }
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/pc.svg' },
      { url: '/pc.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/pc.svg', sizes: '16x16', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/pc.svg' },
      { url: '/pc.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/pc.svg',
      },
    ],
  },
  category: 'productivity',
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
    colorScheme: 'light dark',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sitemaker.advay.ca' || 'http://localhost:3000'
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SiteMaker",
    "description": "Professional website generator for creating modern portfolios",
    "url": baseUrl,
    "logo": `${baseUrl}/pc.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": []
  }

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SiteMaker - Personal Website Generator",
    "description": "Generate a modern, responsive personal website from your resume. Build professional portfolios with AI-powered design and customizable templates.",
    "url": baseUrl,
    "applicationCategory": "WebApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "SiteMaker",
      "url": baseUrl
    },
    "featureList": [
      "AI-powered design",
      "Responsive templates",
      "Resume parsing",
      "Professional portfolios",
      "Customizable themes"
    ],
    "screenshot": `${baseUrl}/banner.png`
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ]
  }

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={baseUrl} />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="application-name" content="SiteMaker" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SiteMaker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="shortcut icon" href="/pc.svg" />
      </head>
      <body className="font-inter">
        <WebVitals />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      </body>
    </html>
  )
}