# Footer

> A footer component that displays social links and copyright information.

## Overview
The Footer component renders a footer section with navigation links (RSS, GitHub, and view source) alongside a copyright notice. Each link includes an arrow icon and opens in a new tab. The component is styled with responsive layout that stacks vertically on mobile and horizontally on desktop.

## Props
This component does not accept any props.

## Usage

### Basic
```tsx
import Footer from './components/footer'

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  )
}
```

### Advanced
```tsx
import Footer from './components/footer'

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        {/* Header content */}
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

## Internal Components

### ArrowIcon
A helper SVG component that renders a diagonal arrow icon (12x12px) used next to each footer link. It uses `currentColor` for the fill, allowing it to inherit the text color from its parent.

## Styling
- Uses Tailwind CSS classes for responsive layout
- Implements dark mode support with `dark:` variants
- Text color transitions on hover for better UX
- Bottom margin of `mb-16` to provide spacing from page bottom
- Responsive flex layout: vertical on mobile (`flex-col`), horizontal on medium screens and up (`md:flex-row`)

## Accessibility
- All external links include `rel="noopener noreferrer"` for security
- All external links open in new tabs with `target="_blank"`
- Semantic `<footer>` element for proper document structure

## Notes
- The copyright year dynamically updates using `new Date().getFullYear()`
- The component includes hardcoded links to RSS feed, GitHub repository, and Vercel template source
- To customize links, you'll need to modify the `href` attributes directly in the component
- The ArrowIcon component is internal and not exported separately
