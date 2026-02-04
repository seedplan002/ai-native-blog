import { NextResponse } from 'next/server'

type LikesStore = Map<string, number>

// 간단한 인메모리 저장소 (배포 환경에서는 영속 스토리지로 교체 필요)
const likesStore: LikesStore = new Map()

const getLikesForSlug = (slug: string): number => {
  const value = likesStore.get(slug)
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0
}

const incrementLikesForSlug = (slug: string): number => {
  const currentLikes = getLikesForSlug(slug)
  const nextLikes = currentLikes + 1
  likesStore.set(slug, nextLikes)
  return nextLikes
}

const buildJsonResponse = (likes: number, init?: ResponseInit) => {
  return NextResponse.json(
    { likes },
    {
      status: 200,
      ...init,
    }
  )
}

export async function GET(
  _request: Request,
  context: { params: { slug: string } }
): Promise<NextResponse<{ likes: number }>> {
  const slug = context.params.slug
  const likes = getLikesForSlug(slug)

  return buildJsonResponse(likes, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

export async function POST(
  _request: Request,
  context: { params: { slug: string } }
): Promise<NextResponse<{ likes: number }>> {
  const slug = context.params.slug
  const likes = incrementLikesForSlug(slug)

  return buildJsonResponse(likes)
}

