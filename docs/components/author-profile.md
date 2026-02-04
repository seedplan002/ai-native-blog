# AuthorProfile

> A component that displays author information with an avatar, name, and biography in a horizontally aligned layout.

## Overview

The `AuthorProfile` component renders a bordered section containing the author's profile information. It combines an avatar image with textual details (name and bio) in a horizontal layout with a top border separator. This component is typically used at the end of blog posts to provide context about the content author.

The component automatically handles dark mode styling and uses Next.js's optimized Image component for the avatar.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| author | Author | Yes | - | The author object containing name, bio, and avatar URL |

### Author Type

```typescript
type Author = {
  name: string    // The author's display name
  bio: string     // A short biography or description of the author
  avatar: string  // URL or path to the author's avatar image
}
```

## Usage

### Basic

```tsx
import { AuthorProfile } from 'app/components/author-profile'

const author = {
  name: 'Jane Doe',
  bio: 'Software engineer and technical writer.',
  avatar: '/authors/jane-doe.jpg'
}

export default function BlogPost() {
  return (
    <article>
      <h1>My Blog Post</h1>
      <p>Article content here...</p>

      <AuthorProfile author={author} />
    </article>
  )
}
```

### Advanced

```tsx
import { AuthorProfile } from 'app/components/author-profile'
import { getAuthor } from 'app/blog/authors'

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  // Fetch post data with author information
  const post = await getBlogPost(params.slug)
  const author = getAuthor(post.metadata.author)

  return (
    <article className="prose dark:prose-invert max-w-3xl mx-auto">
      <header>
        <h1>{post.metadata.title}</h1>
        <time>{post.metadata.publishedAt}</time>
      </header>

      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Author profile appears at the bottom with border separator */}
      <AuthorProfile author={author} />
    </article>
  )
}
```

## Internal Components

This component is composed of two internal sub-components:

### AuthorAvatar
Renders the author's profile image using Next.js Image component with optimized loading.
- Avatar size: 56x56 pixels
- Rounded corners via `rounded-full` class

### AuthorDetails
Displays the author's name and bio in a stacked vertical layout.
- Name: Bold text with theme-aware coloring
- Bio: Smaller, muted text with theme-aware coloring

## Styling

The component uses Tailwind CSS with built-in dark mode support:
- Container has top margin and border separator
- Avatar and text are horizontally aligned with 1rem gap
- All text colors adapt to light/dark themes automatically

## Notes

- The component requires Next.js's `Image` component and expects properly formatted image URLs
- Avatar images should ideally be square for best display results
- The component uses a fixed avatar size of 56x56 pixels
- Dark mode styles are automatically applied based on the user's system preference or theme setting
- The top border serves as a visual separator, making it ideal for placement at the end of content sections
