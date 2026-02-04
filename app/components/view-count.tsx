'use client'

import { useEffect, useState } from 'react'

interface ViewCountProps {
  slug: string
}

interface ViewsApiResponse {
  slug: string
  views: number
}

export const ViewCount = ({ slug }: ViewCountProps) => {
  const [views, setViews] = useState<number | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const updateViews = async () => {
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        })

        if (!response.ok) {
          throw new Error('Failed to update views')
        }

        const data = (await response.json()) as ViewsApiResponse
        if (!isMounted) return

        const nextViews =
          typeof data.views === 'number' && Number.isFinite(data.views) && data.views >= 0
            ? data.views
            : 0

        setViews(nextViews)
        setHasError(false)
      } catch {
        if (!isMounted) return
        setHasError(true)
      }
    }

    updateViews()

    return () => {
      isMounted = false
    }
  }, [slug])

  const displayViews = views ?? 0

  if (hasError) {
    return (
      <p
        className="text-xs text-red-500 dark:text-red-400"
        aria-live="polite"
      >
        조회수를 불러오는 데 문제가 발생했습니다.
      </p>
    )
  }

  return (
    <p
      className="text-sm text-neutral-600 dark:text-neutral-400"
      aria-live="polite"
      aria-label={`조회수 ${displayViews.toLocaleString()}회`}
    >
      조회수 {displayViews.toLocaleString()}회
    </p>
  )
}

