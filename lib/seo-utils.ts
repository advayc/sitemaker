/**
 * SEO Utilities for SiteMaker
 * Centralized functions for managing SEO metadata and structured data
 */

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  twitterHandle?: string
  noIndex?: boolean
}

/**
 * Generate page-specific metadata
 */
export function generatePageMetadata(config: SEOConfig) {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonicalUrl,
      images: config.ogImage ? [{ url: config.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: config.title,
      description: config.description,
      creator: config.twitterHandle,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    robots: {
      index: !config.noIndex,
      follow: !config.noIndex,
    },
    alternates: {
      canonical: config.canonicalUrl,
    },
  }
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationSchema(data: {
  name: string
  description: string
  url: string
  logo?: string
  contactEmail?: string
  socialProfiles?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.description,
    url: data.url,
    logo: data.logo,
    contactPoint: data.contactEmail ? {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: data.contactEmail,
    } : undefined,
    sameAs: data.socialProfiles,
  }
}

/**
 * Generate structured data for person/portfolio
 */
export function generatePersonSchema(data: {
  name: string
  jobTitle?: string
  description?: string
  email?: string
  telephone?: string
  url?: string
  image?: string
  location?: string
  skills?: string[]
  education?: Array<{
    institution: string
    degree?: string
    field?: string
  }>
  workExperience?: Array<{
    company: string
    position: string
    startDate?: string
    endDate?: string
  }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    email: data.email,
    telephone: data.telephone,
    url: data.url,
    image: data.image,
    address: data.location ? {
      '@type': 'PostalAddress',
      addressLocality: data.location,
    } : undefined,
    skills: data.skills,
    alumniOf: data.education?.map(edu => ({
      '@type': 'Organization',
      name: edu.institution,
      description: `${edu.degree} in ${edu.field}`.trim(),
    })),
    worksFor: data.workExperience?.slice(0, 1).map(exp => ({
      '@type': 'Organization',
      name: exp.company,
      description: exp.position,
    })),
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Optimize meta description length
 */
export function optimizeMetaDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description
  
  const trimmed = description.substring(0, maxLength - 3)
  const lastSpace = trimmed.lastIndexOf(' ')
  
  return lastSpace > maxLength * 0.8 
    ? trimmed.substring(0, lastSpace) + '...'
    : trimmed + '...'
}

/**
 * Generate SEO-friendly URL slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Extract keywords from text content
 */
export function extractKeywords(text: string, existingKeywords: string[] = []): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
  ])
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
  
  const wordFreq = words.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1
    return freq
  }, {} as Record<string, number>)
  
  const sortedWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
  
  return [...new Set([...existingKeywords, ...sortedWords])]
}