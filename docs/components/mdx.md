# CustomMDX

> A React component for rendering MDX content with custom components and syntax highlighting.

## Overview
The `CustomMDX` component is a wrapper around `next-mdx-remote/rsc`'s `MDXRemote` that provides enhanced MDX rendering with custom components for headings, links, images, code blocks, and tables. It automatically generates slugified IDs for headings, handles internal/external links appropriately, applies syntax highlighting to code blocks using sugar-high, and provides styled components for better markdown rendering.

This component is designed for use in Next.js applications where MDX content needs to be rendered with consistent styling and behavior across the application.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| source | string | Yes | - | The MDX source string to be rendered |
| components | Record<string, React.ComponentType<any>> | No | undefined | Custom component overrides to merge with the default MDX components |

## Usage

### Basic

```tsx
import { CustomMDX } from '@/app/components/mdx'

export default function BlogPost() {
  const mdxSource = `
# Welcome to My Blog

This is a **bold** statement with some *italic* text.

[Visit my homepage](/)
[External link](https://example.com)
  `

  return (
    <article>
      <CustomMDX source={mdxSource} />
    </article>
  )
}
```

### Advanced

```tsx
import { CustomMDX } from '@/app/components/mdx'

// Custom component to override default behavior
const CustomCallout = ({ children }: { children: React.ReactNode }) => (
  <div className="callout bg-blue-100 p-4 rounded-lg">
    {children}
  </div>
)

export default function BlogPost() {
  const mdxSource = `
# Advanced MDX Features

## Code Highlighting

\`\`\`javascript
const greeting = "Hello, World!"
console.log(greeting)
\`\`\`

## Tables

| Feature | Supported |
|---------|-----------|
| Headings | Yes |
| Links | Yes |
| Images | Yes |

## Images

![Alt text](/path/to/image.jpg)

<Callout>
This is a custom callout component
</Callout>
  `

  return (
    <article className="prose">
      <CustomMDX
        source={mdxSource}
        components={{
          Callout: CustomCallout
        }}
      />
    </article>
  )
}
```

## Built-in Component Customizations

The `CustomMDX` component provides the following customized MDX components by default:

### Headings (h1-h6)
- Automatically generates slugified IDs from heading text
- Adds anchor links for easy section linking
- Converts text to lowercase, replaces spaces with hyphens, and removes special characters

### Links (a)
- **Internal links** (starting with `/`): Rendered using Next.js `Link` component for client-side navigation
- **Anchor links** (starting with `#`): Rendered as standard anchor tags
- **External links**: Automatically opens in new tab with `target="_blank"` and `rel="noopener noreferrer"` for security

### Images (Image)
- Wraps Next.js `Image` component with `rounded-lg` className for rounded corners
- Maintains all standard Next.js Image optimization features

### Code (code)
- Applies syntax highlighting using the `sugar-high` library
- Renders highlighted HTML safely using `dangerouslySetInnerHTML`

### Tables (Table)
- Accepts `data` prop with structure: `{ headers: string[], rows: string[][] }`
- Renders semantic HTML table with `thead` and `tbody` elements

## Helper Functions

### slugify(text: string): string
Converts heading text into URL-safe slugs:
- Converts to lowercase
- Trims whitespace
- Replaces spaces with hyphens
- Replaces `&` with `-and-`
- Removes non-word characters
- Collapses multiple hyphens

### isInternalLink(href: string): boolean
Returns `true` if the link starts with `/`

### isAnchorLink(href: string): boolean
Returns `true` if the link starts with `#`

## Notes

- This component requires `next-mdx-remote`, `next/link`, `next/image`, and `sugar-high` as dependencies
- The component is designed for Next.js App Router (uses React Server Components via `/rsc` import)
- Custom components passed via the `components` prop will override default components with the same name
- All heading text should be strings for proper slug generation
- Code blocks receive syntax highlighting automatically via the `sugar-high` library
- External links automatically receive security attributes to prevent tabnapping vulnerabilities
- The component maintains accessibility by using semantic HTML elements and proper ARIA attributes through anchor links
