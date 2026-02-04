# NotFound

> A 404 error page component that displays when a user navigates to a non-existent route.

## Overview
The `NotFound` component is a standard error page used by Next.js to handle 404 (Page Not Found) errors. It displays a simple, user-friendly message informing visitors that the requested page does not exist. This component is typically placed in the `app` directory as `not-found.tsx` to leverage Next.js's built-in error handling.

## Props
This component does not accept any props.

## Usage
### Basic
```tsx
// This component is automatically used by Next.js when a route is not found.
// Place it in app/not-found.tsx

import NotFound from './not-found';

export default NotFound;
```

### Advanced
```tsx
// You can also trigger this component programmatically using Next.js's notFound() function
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const data = await fetchData(params.id);

  if (!data) {
    notFound(); // This will render the NotFound component
  }

  return <div>{data.content}</div>;
}
```

## Implementation Details
- **Title**: Displays "404 - Page Not Found" as a large heading with semibold font weight and tight letter spacing
- **Message**: Shows "The page you are looking for does not exist." as body text
- **Styling**: Uses Tailwind CSS classes for responsive typography and spacing
- **Constants**: Title and message text are defined as constants at the top of the file for easy customization

## Notes
- This is a Next.js special file convention. When placed at `app/not-found.tsx`, it automatically handles 404 errors for the entire application.
- The component uses semantic HTML with a `<section>` wrapper for proper document structure.
- To customize the 404 page, modify the `TITLE` and `MESSAGE` constants or update the JSX structure.
- For nested route segments, you can create segment-specific `not-found.tsx` files to provide different 404 pages for different sections of your application.
