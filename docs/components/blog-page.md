# BlogPage

> A Next.js page component that displays a list of all blog posts.

## Overview

The `BlogPage` component serves as the main blog listing page in the application. It renders a heading and utilizes the `BlogPosts` component to display all available blog posts sorted by publication date in descending order. This is a server component in Next.js that includes metadata for SEO purposes.

## Props

This component does not accept any props. It is a Next.js page component located at `/blog` route.

## Metadata

The component exports static metadata for SEO:

```typescript
{
  title: 'Blog',
  description: 'Read my blog.'
}
```

## Usage

### Basic

This component is automatically rendered when users navigate to the `/blog` route:

```tsx
// app/blog/page.tsx
import { BlogPosts } from 'app/components/posts'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts />
    </section>
  )
}
```

### In Next.js App Router

The component is placed in the file structure as:
```
app/
└── blog/
    └── page.tsx  (this component)
```

When deployed, this creates the route: `https://yourdomain.com/blog`

## Component Structure

The page component consists of:

1. **Section wrapper**: Contains the entire blog listing page
2. **Heading**: Displays "My Blog" with styling classes for typography
3. **BlogPosts component**: Renders the actual list of blog posts

## Styling

The component uses Tailwind CSS utility classes:
- `font-semibold`: Semi-bold font weight for the heading
- `text-2xl`: Large text size (1.5rem)
- `mb-8`: Bottom margin of 2rem
- `tracking-tighter`: Tighter letter spacing for improved typography

## Dependencies

- `app/components/posts`: Provides the `BlogPosts` component that handles fetching and rendering blog posts

## Related Components

- `BlogPosts` (app/components/posts.tsx): Handles the actual blog post list rendering
- Individual blog post pages at `app/blog/[slug]/page.tsx`

## Notes

- This is a Next.js App Router page component (Server Component by default).
- The component does not handle data fetching directly; this responsibility is delegated to the `BlogPosts` component.
- Metadata is exported at the page level for Next.js to automatically generate appropriate meta tags.
- The page uses semantic HTML with a `<section>` element as the root container.
- No client-side interactivity is present; this is a static server-rendered page.
