# Blog Post Page Component

> Next.js dynamic route page component that renders individual blog post pages with SEO metadata, structured data, and author information.

## Overview

This is a Next.js App Router page component located at `app/blog/[slug]/page.tsx` that handles dynamic blog post rendering. It fetches blog posts from the file system, generates static params for SSG, creates SEO-friendly metadata including Open Graph and Twitter cards, injects JSON-LD structured data for search engines, and displays the post content with author profile information. The component returns a 404 page if the requested slug is not found.

## Component Architecture

This file exports three main functions:

1. **generateStaticParams** - Generates static paths for all blog posts at build time
2. **generateMetadata** - Creates dynamic metadata for SEO (Open Graph, Twitter cards)
3. **Blog** (default export) - The main page component that renders the blog post

## Type Definitions

### PageParams

```typescript
interface PageParams {
  params: Promise<{ slug: string }>
}
```

Parameters passed to the page component by Next.js App Router.

| Property | Type | Description |
|----------|------|-------------|
| params | Promise<{ slug: string }> | Async params object containing the dynamic route slug |

### BlogPost

```typescript
interface BlogPost {
  slug: string
  content: string
  metadata: {
    title: string
    publishedAt: string
    summary: string
    image?: string
    author: string
  }
}
```

Represents a blog post with its content and metadata.

| Property | Type | Description |
|----------|------|-------------|
| slug | string | URL-friendly identifier for the post |
| content | string | MDX content of the blog post |
| metadata.title | string | Post title |
| metadata.publishedAt | string | Publication date in ISO format |
| metadata.summary | string | Brief description of the post |
| metadata.image | string \| undefined | Optional custom OG image URL |
| metadata.author | string | Author name |

### Author

```typescript
interface Author {
  name: string
}
```

Minimal author information (extended by the `getAuthor` utility to include bio and avatar).

## Exported Functions

### generateStaticParams

```typescript
export async function generateStaticParams(): Promise<Array<{ slug: string }>>
```

Generates static parameters for all blog posts at build time. This enables Static Site Generation (SSG) for all blog post pages.

**Returns:** Array of objects containing slug values for each blog post.

### generateMetadata

```typescript
export async function generateMetadata({ params }: PageParams): Promise<Metadata | undefined>
```

Generates dynamic metadata for the blog post page, including title, description, Open Graph tags, and Twitter card metadata.

**Parameters:**
- `params` (PageParams): Contains the dynamic route slug

**Returns:** Next.js Metadata object or undefined if post not found.

### Blog (default export)

```typescript
export default async function Blog({ params }: PageParams): Promise<JSX.Element>
```

Main page component that renders the blog post with structured data, header, content, and author profile.

**Parameters:**
- `params` (PageParams): Contains the dynamic route slug

**Returns:** JSX element containing the complete blog post page.

**Behavior:**
- If the post is not found, calls `notFound()` to render 404 page
- Injects JSON-LD structured data for SEO
- Renders post header with title and formatted date
- Renders MDX content using `CustomMDX` component
- Displays author profile at the bottom

## Internal Helper Functions

### findPostBySlug

```typescript
const findPostBySlug = (slug: string): BlogPost | undefined
```

Finds a blog post by its slug identifier.

### generateOgImageUrl

```typescript
const generateOgImageUrl = (title: string, image?: string): string
```

Generates Open Graph image URL, using custom image if provided or falling back to dynamic OG image generation endpoint.

### createOpenGraphMetadata

```typescript
const createOpenGraphMetadata = (post: BlogPost, ogImageUrl: string): OpenGraphMetadata
```

Creates Open Graph metadata object for social media sharing.

### createTwitterMetadata

```typescript
const createTwitterMetadata = (post: BlogPost, ogImageUrl: string): TwitterMetadata
```

Creates Twitter card metadata for Twitter/X sharing.

### getStructuredDataImageUrl

```typescript
const getStructuredDataImageUrl = (post: BlogPost): string
```

Gets the image URL for JSON-LD structured data, ensuring proper absolute URL formatting.

### createStructuredData

```typescript
const createStructuredData = (post: BlogPost, author: Author): object
```

Creates JSON-LD structured data conforming to schema.org BlogPosting specification.

## Internal Components

### StructuredDataScript

```typescript
const StructuredDataScript = ({ post, author }: { post: BlogPost; author: Author }): JSX.Element
```

Renders a script tag containing JSON-LD structured data for search engine optimization.

**Props:**
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| post | BlogPost | Yes | - | The blog post data |
| author | Author | Yes | - | The author information |

### BlogPostHeader

```typescript
const BlogPostHeader = ({ title, publishedAt }: { title: string; publishedAt: string }): JSX.Element
```

Renders the blog post title and publication date.

**Props:**
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | Yes | - | Post title |
| publishedAt | string | Yes | - | Publication date (ISO format) |

### BlogPostContent

```typescript
const BlogPostContent = ({ content }: { content: string }): JSX.Element
```

Renders the MDX content of the blog post within a prose-styled article container.

**Props:**
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| content | string | Yes | - | MDX content to render |

## Dependencies

- `next/navigation` - For `notFound()` function
- `app/components/mdx` - CustomMDX component for rendering MDX content
- `app/blog/utils` - `formatDate` and `getBlogPosts` utilities
- `app/blog/authors` - `getAuthor` utility for author data
- `app/components/author-profile` - AuthorProfile component
- `app/sitemap` - `baseUrl` for generating absolute URLs

## Usage

This is a Next.js page component and is automatically routed by the framework. It should not be imported directly. Instead, it responds to routes matching `/blog/[slug]`.

### Example URL Patterns

```
/blog/my-first-post
/blog/introducing-nextjs-14
/blog/typescript-best-practices
```

### Creating a New Blog Post

To create a new post that this component will render:

1. Create an MDX file in `app/blog/posts/` directory
2. Include required frontmatter:

```mdx
---
title: Your Post Title
publishedAt: 2024-02-04
summary: A brief summary of your post
author: Your Name
image: /optional-og-image.jpg
---

Your MDX content here...
```

3. The file name (without .mdx extension) becomes the slug
4. The component will automatically generate a static page at build time

## SEO Features

- Automatic Open Graph metadata generation for social media previews
- Twitter card support for enhanced Twitter/X sharing
- JSON-LD structured data (schema.org BlogPosting) for rich search results
- Dynamic OG image generation fallback
- Semantic HTML structure with proper article tags

## Error Handling

- Returns 404 page via `notFound()` if slug doesn't match any existing post
- Safe metadata generation (returns undefined if post not found)

## Notes

- This component uses Next.js App Router conventions with async server components
- All params are async in Next.js 15+ (hence `await params`)
- Static generation occurs at build time via `generateStaticParams`
- The component is server-side only and does not include client-side JavaScript
- Styling relies on Tailwind CSS utility classes and prose plugin for MDX content
- Structured data follows schema.org standards for better search engine understanding
