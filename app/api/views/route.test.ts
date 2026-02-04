import '@testing-library/jest-dom'
import { GET, POST, __resetViewsForTest } from './route'

describe('Views API Route', () => {
  const createRequest = (url: string, init?: RequestInit) => new Request(url, init)

  beforeEach(() => {
    __resetViewsForTest()
  })

  describe('GET /api/views', () => {
    it('slug 쿼리 파라미터가 없으면 400을 반환해야 한다', async () => {
      const request = createRequest('http://localhost:3000/api/views')

      const response = GET(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body).toEqual({
        error: 'Missing required "slug" query parameter',
      })
    })

    it('초기 조회수는 0으로 반환해야 한다', async () => {
      const request = createRequest('http://localhost:3000/api/views?slug=test-post')

      const response = GET(request)

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body).toEqual({
        slug: 'test-post',
        views: 0,
      })
    })

    it('조회수가 증가한 후에는 최신 값을 반환해야 한다', async () => {
      const slug = 'increment-post'

      // 두 번 증가
      await POST(
        createRequest('http://localhost:3000/api/views', {
          method: 'POST',
          body: JSON.stringify({ slug }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      await POST(
        createRequest('http://localhost:3000/api/views', {
          method: 'POST',
          body: JSON.stringify({ slug }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )

      const response = GET(
        createRequest(`http://localhost:3000/api/views?slug=${encodeURIComponent(slug)}`)
      )

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body).toEqual({
        slug,
        views: 2,
      })
    })
  })

  describe('POST /api/views', () => {
    it('유효한 slug가 없으면 400을 반환해야 한다', async () => {
      const request = createRequest('http://localhost:3000/api/views', {
        method: 'POST',
        body: JSON.stringify({ slug: '' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body).toEqual({
        error: 'Request body must include a non-empty "slug" field',
      })
    })

    it('JSON이 아니면 400을 반환해야 한다', async () => {
      const request = createRequest('http://localhost:3000/api/views', {
        method: 'POST',
        body: 'not-json',
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
      const body = await response.json()
      expect(body).toEqual({
        error: 'Invalid JSON in request body',
      })
    })

    it('slug 조회수를 1씩 증가시켜야 한다', async () => {
      const slug = 'post-slug'

      const firstResponse = await POST(
        createRequest('http://localhost:3000/api/views', {
          method: 'POST',
          body: JSON.stringify({ slug }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      const firstBody = await firstResponse.json()

      expect(firstResponse.status).toBe(200)
      expect(firstBody).toEqual({
        slug,
        views: 1,
      })

      const secondResponse = await POST(
        createRequest('http://localhost:3000/api/views', {
          method: 'POST',
          body: JSON.stringify({ slug }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
      const secondBody = await secondResponse.json()

      expect(secondResponse.status).toBe(200)
      expect(secondBody).toEqual({
        slug,
        views: 2,
      })
    })

    it('slug 앞뒤 공백을 제거하고 저장해야 한다', async () => {
      const request = createRequest('http://localhost:3000/api/views', {
        method: 'POST',
        body: JSON.stringify({ slug: '  spaced-slug  ' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.slug).toBe('spaced-slug')
      expect(body.views).toBe(1)
    })
  })
}

