# OG Image Route

> Next.js API route handler for generating dynamic Open Graph (OG) images using @vercel/og.

## Overview

This is a Next.js Route Handler that dynamically generates Open Graph images for social media sharing. It uses the `next/og` package (Vercel's OG Image Generation) to create PNG images on-the-fly based on query parameters. The generated images are 1200x630 pixels, which is the standard size for Open Graph images on platforms like Twitter, Facebook, and LinkedIn.

## Route Information

- **Path**: `/og`
- **Method**: `GET`
- **Export**: Named export `GET` function (Next.js 13+ App Router convention)
- **Response Type**: PNG image (via `ImageResponse`)

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| title | string | No | "Next.js Portfolio Starter" | The title text to display on the generated OG image |

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| OG_IMAGE_WIDTH | 1200 | Width of the generated OG image in pixels |
| OG_IMAGE_HEIGHT | 630 | Height of the generated OG image in pixels |
| DEFAULT_TITLE | "Next.js Portfolio Starter" | Default title when no title parameter is provided |

## Usage

### Basic Usage (Default Title)

```tsx
// In your Next.js page metadata
export const metadata = {
  openGraph: {
    images: ['/og'],
  },
};
```

Direct URL access:
```
https://yourdomain.com/og
```

### With Custom Title

```tsx
// In your Next.js page metadata
export const metadata = {
  openGraph: {
    images: [`/og?title=${encodeURIComponent('My Blog Post Title')}`],
  },
};
```

Direct URL access:
```
https://yourdomain.com/og?title=My%20Blog%20Post%20Title
```

### In Blog Post Pages

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  return {
    title: post.metadata.title,
    openGraph: {
      title: post.metadata.title,
      images: [`/og?title=${encodeURIComponent(post.metadata.title)}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      images: [`/og?title=${encodeURIComponent(post.metadata.title)}`],
    },
  };
}
```

### HTML Meta Tags Output

When used in metadata, this route generates meta tags like:

```html
<meta property="og:image" content="https://yourdomain.com/og?title=My%20Post%20Title" />
<meta name="twitter:image" content="https://yourdomain.com/og?title=My%20Post%20Title" />
```

## Implementation Details

### Technology Stack
- **next/og**: Vercel's library for generating dynamic images using JSX syntax
- **Tailwind CSS (tw prop)**: Uses Tailwind-like syntax via the `tw` prop for styling (supported by `ImageResponse`)
- **Next.js 13+ App Router**: Route Handler pattern with named exports

### Image Generation Process
1. Extract the `title` query parameter from the request URL
2. Fall back to `DEFAULT_TITLE` if no title is provided
3. Render JSX with Tailwind-style classes using the `tw` prop
4. Return an `ImageResponse` object with specified dimensions

### Styling
The image uses a clean, minimal design:
- White background
- Centered layout with flexbox
- Large, bold text (4xl font size)
- Responsive padding and spacing
- Left-aligned title text

## Performance Considerations

- Images are generated on-demand for each unique title
- Vercel automatically caches OG images at the edge
- Generation time is typically under 100ms
- No external fonts are loaded (uses system fonts)

## Limitations

- Only accepts a single `title` parameter
- No support for custom colors, fonts, or additional metadata in the current implementation
- Uses system fonts only (no custom web fonts loaded)

## Potential Enhancements

To extend this route handler, consider:
- Adding `description` and `author` parameters
- Supporting custom background colors or gradients
- Loading custom fonts using `next/font`
- Adding a logo or avatar image
- Supporting different image dimensions for various platforms
- Adding date formatting for blog posts

## Related Documentation

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel OG Image Generation](https://vercel.com/docs/functions/edge-functions/og-image-generation)
- [Open Graph Protocol](https://ogp.me/)

## Notes

- This route handler is a Next.js App Router feature (Next.js 13+)
- The `tw` prop is a special prop provided by `next/og` that accepts Tailwind-like class names
- The route automatically returns proper headers for PNG images
- For best results, always URL-encode the title parameter when passing special characters
- The generated image meets social media platform requirements for OG images (1200x630 is widely supported)
