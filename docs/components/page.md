# Page

> The main homepage component that displays portfolio introduction and blog posts list.

## Overview

The `Page` component serves as the root homepage for the portfolio blog application. It renders a simple layout consisting of a portfolio title, an introduction paragraph about the author's technical preferences, and a list of blog posts sorted by publication date. This component is a Next.js App Router page component located at the root route (`/`).

## Props

This component does not accept any props. It is a default exported page component for Next.js App Router.

## Constants

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `PORTFOLIO_TITLE` | `string` | `'My Portfolio'` | The main heading displayed at the top of the page |
| `INTRODUCTION_TEXT` | `string` | Multi-line text | Static introduction text describing the author's technical preferences |

## Dependencies

- `BlogPosts` component from `app/components/posts` - Renders the list of all blog posts

## Usage

### Basic

This component is automatically rendered by Next.js when the root route is accessed:

```tsx
// app/page.tsx
import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        I'm a Vim enthusiast and tab advocate...
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
```

### Advanced

To customize the homepage content, modify the constants at the top of the file:

```tsx
// app/page.tsx
import { BlogPosts } from 'app/components/posts'

const PORTFOLIO_TITLE = 'John Doe - Software Engineer'

const INTRODUCTION_TEXT = `Full-stack developer with 5 years of experience
building scalable web applications. Passionate about TypeScript, React, and
modern web technologies.`

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        {PORTFOLIO_TITLE}
      </h1>
      <p className="mb-4">
        {INTRODUCTION_TEXT}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
```

## Layout Structure

The component returns a semantic `<section>` element containing:

1. **Heading** (`<h1>`): Displays the portfolio title with styling classes for spacing, font size, weight, and tracking
2. **Introduction Paragraph** (`<p>`): Shows the static introduction text with bottom margin
3. **Blog Posts Container** (`<div>`): Wraps the `BlogPosts` component with vertical margin spacing

## Styling

The component uses Tailwind CSS utility classes:

- `mb-8`: bottom margin of 2rem (32px)
- `text-2xl`: font size of 1.5rem (24px)
- `font-semibold`: semi-bold font weight (600)
- `tracking-tighter`: tighter letter spacing
- `mb-4`: bottom margin of 1rem (16px)
- `my-8`: vertical margin of 2rem (32px)

## Notes

- This is a Next.js 13+ App Router page component, using the default export pattern
- The component is a server component by default (no 'use client' directive)
- Blog posts are rendered via the `BlogPosts` component, which fetches and sorts posts by date
- The introduction text and title are defined as constants for easy maintenance
- No dynamic data fetching occurs at this level; all blog data fetching is delegated to the `BlogPosts` component
- The component uses semantic HTML with a `<section>` element as the root container
