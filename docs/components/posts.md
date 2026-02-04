# BlogPosts

> A component that displays a list of blog posts sorted by publication date in descending order.

## Overview

The `BlogPosts` component fetches all blog posts from the filesystem, sorts them by publication date (newest first), and renders them as a list of clickable links. Each blog post item displays the publication date and title in a responsive layout.

This component is designed to be used on the blog homepage or any page where a chronological list of all blog posts is needed.

## Components

### BlogPosts

The main export component that fetches and displays all blog posts.

#### Props

This component accepts no props.

#### Return Type

Returns a JSX element containing a list of `BlogPostItem` components wrapped in a `div`.

---

### BlogPostItem

An internal component that renders an individual blog post as a clickable link.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| slug | `string` | Yes | - | The URL slug for the blog post, used to generate the link to `/blog/{slug}` |
| title | `string` | Yes | - | The title of the blog post |
| publishedAt | `string` | Yes | - | The publication date in ISO 8601 format (e.g., "2024-01-15" or "2024-01-15T00:00:00") |

---

## Utilities

### sortPostsByDateDescending

A helper function that sorts blog posts by publication date in descending order (newest first).

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| posts | `BlogPost[]` | Array of blog posts to sort |

#### Returns

`BlogPost[]` - Sorted array with the most recent posts first.

---

## Types

### BlogPost

```typescript
interface BlogPost {
  slug: string
  metadata: {
    title: string
    publishedAt: string
  }
}
```

### BlogPostItemProps

```typescript
interface BlogPostItemProps {
  slug: string
  title: string
  publishedAt: string
}
```

---

## Usage

### Basic

```tsx
import { BlogPosts } from 'app/components/posts'

export default function BlogPage() {
  return (
    <div>
      <h1>All Posts</h1>
      <BlogPosts />
    </div>
  )
}
```

### Advanced (with custom layout)

```tsx
import { BlogPosts } from 'app/components/posts'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section>
        <h2 className="text-3xl font-bold mb-6">Recent Articles</h2>
        <p className="text-gray-600 mb-8">
          Explore my latest thoughts on web development, design, and technology.
        </p>
        <BlogPosts />
      </section>
    </main>
  )
}
```

---

## Dependencies

This component depends on the following utilities and external libraries:

- `next/link` - Next.js Link component for client-side navigation
- `app/blog/utils` - Contains `getBlogPosts()` and `formatDate()` functions
  - `getBlogPosts()`: Fetches all MDX blog posts from the filesystem
  - `formatDate(date: string, includeRelative: boolean)`: Formats dates for display

---

## Styling

The component uses Tailwind CSS utility classes with the following features:

- **Responsive layout**: Flexbox layout switches from column (mobile) to row (desktop) at the `md` breakpoint
- **Dark mode support**: Includes `dark:` variants for text colors
- **Typography**: Uses `tabular-nums` for consistent date alignment
- **Spacing**: Consistent spacing with `mb-4` between items and responsive `space-x` utilities

### CSS Classes Used

- `flex flex-col space-y-1 mb-4` - Container for each blog post item
- `w-full flex flex-col md:flex-row space-x-0 md:space-x-2` - Responsive row layout
- `text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums` - Date styling
- `text-neutral-900 dark:text-neutral-100 tracking-tight` - Title styling

---

## Behavior

1. On component mount, `getBlogPosts()` is called to fetch all blog posts from the filesystem
2. Posts are sorted by `publishedAt` date in descending order using `sortPostsByDateDescending()`
3. Each post is rendered as a `BlogPostItem` component
4. Clicking on any post item navigates to `/blog/{slug}`
5. Dates are formatted using `formatDate()` without relative time display (e.g., "January 15, 2024")

---

## Accessibility

- Uses semantic `Link` component from Next.js for proper navigation
- Each blog post item has a unique `key` prop based on the slug
- Link text includes both the date and title for screen reader context
- Hover and focus states are handled by Next.js Link component

---

## Notes

- The component does not handle loading states or error states. It assumes `getBlogPosts()` will always return valid data.
- Blog posts must have `title` and `publishedAt` fields in their frontmatter metadata to render correctly.
- The date formatting is done with `includeRelative: false`, meaning only absolute dates are shown (e.g., "January 15, 2024" instead of "2 days ago").
- The component is designed for server-side rendering and should be used in Server Components in Next.js App Router.
- Posts are expected to be stored as MDX files in the `app/blog/posts` directory.

---

## Related Components

- `app/blog/utils` - Utility functions for fetching and formatting blog posts
- Next.js `Link` - Used for client-side navigation
