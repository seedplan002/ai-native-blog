import { GET, POST } from './route'

describe('likes API route', () => {
  const createContext = (slug: string) => ({
    params: { slug },
  })

  it('GET 요청 시 기본 좋아요 수 0을 반환한다', async () => {
    const response = await GET(new Request('http://localhost/api/likes/test-post'), createContext('test-post'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.likes).toBe(0)
  })

  it('POST 요청 시 좋아요 수를 1 증가시킨다', async () => {
    const slug = 'increment-post'

    const firstPostResponse = await POST(
      new Request('http://localhost/api/likes/increment-post', { method: 'POST' }),
      createContext(slug)
    )
    const firstData = await firstPostResponse.json()

    const secondPostResponse = await POST(
      new Request('http://localhost/api/likes/increment-post', { method: 'POST' }),
      createContext(slug)
    )
    const secondData = await secondPostResponse.json()

    expect(firstData.likes).toBe(1)
    expect(secondData.likes).toBe(2)
  })

  it('같은 slug에 대해 GET과 POST가 일관된 값을 반환해야 한다', async () => {
    const slug = 'consistency-post'

    await POST(
      new Request('http://localhost/api/likes/consistency-post', { method: 'POST' }),
      createContext(slug)
    )

    const getResponse = await GET(
      new Request('http://localhost/api/likes/consistency-post'),
      createContext(slug)
    )
    const getData = await getResponse.json()

    expect(getData.likes).toBe(1)
  })
})

