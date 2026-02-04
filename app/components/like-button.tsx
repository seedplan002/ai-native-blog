 'use client'

import { useEffect, useState } from 'react'

interface LikeButtonProps {
  slug: string
}

interface LikeApiResponse {
  likes: number
}

const BUTTON_BASE_CLASSES =
  'inline-flex items-center gap-2 rounded border px-3 py-1 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed'

const BUTTON_THEME_CLASSES =
  'border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800'

export const LikeButton = ({ slug }: LikeButtonProps) => {
  const [likes, setLikes] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/likes/${encodeURIComponent(slug)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch likes')
        }
        const data = (await response.json()) as LikeApiResponse
        if (isMounted) {
          setLikes(typeof data.likes === 'number' ? data.likes : 0)
        }
      } catch {
        if (isMounted) {
          setLikes(0)
          setHasError(true)
        }
      }
    }

    fetchLikes()

    return () => {
      isMounted = false
    }
  }, [slug])

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    setHasError(false)

    try {
      const response = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to update likes')
      }

      const data = (await response.json()) as LikeApiResponse
      setLikes(typeof data.likes === 'number' ? data.likes : (likes ?? 0) + 1)
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const displayLikes = likes ?? 0

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isLoading}
      aria-label="좋아요 추가"
      className={`${BUTTON_BASE_CLASSES} ${BUTTON_THEME_CLASSES}`}
    >
      <span aria-hidden="true">❤️</span>
      <span>좋아요</span>
      <span className="text-xs text-neutral-500 dark:text-neutral-400">
        {displayLikes.toLocaleString()}개
      </span>
      {hasError && (
        <span className="sr-only">좋아요 수를 불러오거나 저장하는 데 문제가 발생했습니다.</span>
      )}
    </button>
  )
}

