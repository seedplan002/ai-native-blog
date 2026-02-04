# RootLayout

> Root layout component for Next.js application that provides global HTML structure, styling, and metadata configuration.

## Overview

The `RootLayout` component is a Next.js 13+ App Router root layout that wraps the entire application. It sets up the HTML document structure, applies global fonts (Geist Sans and Geist Mono), configures dark mode support, and integrates analytics and performance monitoring. This component also defines the application's metadata for SEO and Open Graph.

This layout is automatically applied to all pages in the Next.js application and should not be manually imported or used in other components.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | `React.ReactNode` | Yes | - | The page content to be rendered within the layout structure |

## Exported Metadata

The component exports a `metadata` object that configures:

- **metadataBase**: Base URL for the site (`https://portfolio-blog-starter.vercel.app`)
- **title**: Default title with template pattern for page-specific titles
- **description**: Site description for SEO
- **openGraph**: Open Graph metadata for social media sharing
- **robots**: Search engine indexing rules and crawler directives

## Features

- **Font Integration**: Uses Geist Sans and Geist Mono fonts via CSS variables
- **Dark Mode**: Automatic dark/light theme support with Tailwind CSS
- **Responsive Layout**: Mobile-first design with responsive margins and max-width constraints
- **Analytics**: Vercel Analytics integration for user tracking
- **Performance Monitoring**: Vercel Speed Insights for performance metrics
- **Consistent Structure**: Navigation bar and footer on all pages

## Layout Structure

The layout provides a consistent structure across all pages:
1. HTML wrapper with language and theme classes
2. Body with centered content container (max-width: 36rem on large screens)
3. Main content area with:
   - Navbar component
   - Page-specific children content
   - Footer component
   - Analytics and Speed Insights tracking

## Usage

### Basic

This component is used automatically by Next.js as the root layout. You don't need to import or use it directly.

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <section>
      <h1>Welcome to my blog</h1>
      <p>This content will be automatically wrapped by RootLayout</p>
    </section>
  )
}
```

### Advanced

To customize metadata for a specific page, use the `metadata` export or `generateMetadata` function in that page:

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  return {
    title: 'My Blog Post',
    description: 'An amazing blog post about Next.js',
    openGraph: {
      title: 'My Blog Post',
      description: 'An amazing blog post about Next.js',
      type: 'article',
    },
  }
}

export default function BlogPost() {
  return (
    <article>
      <h1>My Blog Post</h1>
      <p>Content here...</p>
    </article>
  )
}
```

## Dependencies

- **next**: Next.js framework (App Router)
- **geist/font/sans**: Geist Sans font package
- **geist/font/mono**: Geist Mono font package
- **@vercel/analytics/react**: Vercel Analytics for user tracking
- **@vercel/speed-insights/next**: Vercel Speed Insights for performance monitoring

## Internal Utilities

### combineClassNames

A utility function that combines multiple class names, filtering out falsy values:

```tsx
const combineClassNames = (...classes: (string | boolean | undefined)[]): string =>
  classes.filter(Boolean).join(' ')
```

This is used to conditionally apply CSS classes while maintaining clean code.

## Notes

- This is a Server Component by default in Next.js 13+ App Router
- The layout renders on every page, so expensive operations should be avoided here
- Global CSS is imported at the top of this file (`./global.css`)
- The metadata configuration supports both static and dynamic values
- The `baseUrl` constant is imported from `./sitemap` and should be updated for production deployments
- Tailwind CSS classes handle responsive design and dark mode automatically
- The layout uses semantic HTML5 elements (`<main>`, navigation via Navbar, `<footer>` via Footer)
- Analytics and Speed Insights components are client-side only and won't impact server-side rendering performance
