# Navbar

> A responsive navigation bar component for site-wide navigation with support for internal and external links.

## Overview
The `Navbar` component provides a horizontal navigation menu that displays links defined in the `NAVIGATION_ITEMS` configuration. It uses Next.js Link component for client-side navigation and includes responsive styling with Tailwind CSS. The component supports both internal routes and external URLs.

## Components

### Navbar
The main navigation component that renders a horizontal list of navigation links.

#### Props
This component does not accept any props. Navigation items are configured internally via the `NAVIGATION_ITEMS` constant.

### NavigationLink (Internal)
A child component that renders individual navigation links.

#### Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| path | string | Yes | - | The URL path or external link for the navigation item |
| name | string | Yes | - | The display text for the navigation link |

## Configuration

### NAVIGATION_ITEMS
The navigation structure is defined by the `NAVIGATION_ITEMS` constant:

```tsx
const NAVIGATION_ITEMS: NavigationItems = {
  '/': {
    name: 'home',
  },
  '/blog': {
    name: 'blog',
  },
  'https://vercel.com/templates/next.js/portfolio-starter-kit': {
    name: 'deploy',
  },
}
```

To modify navigation items, update this constant with the desired paths and names.

## Usage

### Basic
```tsx
import { Navbar } from '@/app/components/nav'

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
```

### In Next.js App Router Layout
```tsx
import { Navbar } from '@/app/components/nav'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-4xl mx-auto px-4">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  )
}
```

## Styling
The component uses Tailwind CSS classes for styling:
- **Container**: Negative left margin with bottom spacing and sticky positioning on large screens
- **Navigation**: Flexible row layout with responsive overflow handling
- **Links**: Transition effects with hover states for light and dark modes

The `NAVIGATION_LINK_STYLES` constant defines the link appearance:
```tsx
const NAVIGATION_LINK_STYLES =
  'transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1'
```

## Responsive Behavior
- On mobile: Displays as a horizontal scrollable row
- On desktop (lg breakpoint): Sticky positioning at top-20
- Uses flexbox for consistent spacing across different screen sizes

## Notes
- This component requires Next.js Link component and Tailwind CSS for proper functionality
- External links (starting with http/https) work seamlessly with Next.js Link
- The navigation is rendered inside an `<aside>` semantic element for accessibility
- To add or remove navigation items, modify the `NAVIGATION_ITEMS` constant directly in the component file
- The component supports dark mode through Tailwind's dark mode utilities
- No active link highlighting is implemented by default; this would need to be added separately using Next.js `usePathname` hook if desired
