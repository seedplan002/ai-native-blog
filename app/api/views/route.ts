const viewsBySlug = new Map<string, number>()

const getSafeViews = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value
  }
  return 0
}

const getCurrentViews = (slug: string): number => {
  const current = viewsBySlug.get(slug)
  return getSafeViews(current)
}

const incrementViews = (slug: string): number => {
  const current = getCurrentViews(slug)
  const next = current + 1
  viewsBySlug.set(slug, next)
  return next
}

const createJsonResponse = (body: unknown, init?: ResponseInit): Response => {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...init?.headers,
    },
  })
}

export const GET = (request: Request): Response => {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return createJsonResponse(
      {
        error: 'Missing required "slug" query parameter',
      },
      { status: 400 }
    )
  }

  const views = getCurrentViews(slug)

  return createJsonResponse({
    slug,
    views,
  })
}

export const POST = async (request: Request): Promise<Response> => {
  let slug: unknown

  try {
    const data = (await request.json()) as { slug?: unknown }
    slug = data.slug
  } catch {
    return createJsonResponse(
      {
        error: 'Invalid JSON in request body',
      },
      { status: 400 }
    )
  }

  if (typeof slug !== 'string' || !slug.trim()) {
    return createJsonResponse(
      {
        error: 'Request body must include a non-empty "slug" field',
      },
      { status: 400 }
    )
  }

  const normalizedSlug = slug.trim()
  const views = incrementViews(normalizedSlug)

  return createJsonResponse({
    slug: normalizedSlug,
    views,
  })
}

// 테스트에서 상태를 초기화할 수 있도록 제공되는 헬퍼입니다.
// 실제 애플리케이션 코드에서는 사용하지 않습니다.
export const __resetViewsForTest = (): void => {
  viewsBySlug.clear()
}

