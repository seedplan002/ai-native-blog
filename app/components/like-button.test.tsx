import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LikeButton } from './like-button'

describe('LikeButton', () => {
  const slug = 'test-post'

  beforeEach(() => {
    jest.resetAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).fetch = jest.fn()
  })

  const mockFetch = (implementation: jest.Mock) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).fetch = implementation
  }

  it('초기 렌더링 시 좋아요 수를 요청해야 한다', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ likes: 5 }),
    })
    mockFetch(fetchMock)

    render(<LikeButton slug={slug} />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(`/api/likes/${encodeURIComponent(slug)}`)
    })

    expect(await screen.findByText('5개')).toBeInTheDocument()
  })

  it('좋아요 버튼을 클릭하면 POST 요청을 보내고 카운트를 증가시킨다', async () => {
    const fetchMock = jest
      .fn()
      // 초기 GET
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likes: 1 }),
      })
      // POST 요청
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likes: 2 }),
      })

    mockFetch(fetchMock)

    render(<LikeButton slug={slug} />)

    const button = await screen.findByRole('button', { name: '좋아요 추가' })

    fireEvent.click(button)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(`/api/likes/${encodeURIComponent(slug)}`, {
        method: 'POST',
      })
    })

    expect(await screen.findByText('2개')).toBeInTheDocument()
  })

  it('API 에러가 발생해도 컴포넌트가 깨지지 않아야 한다', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ likes: 0 }),
    })
    mockFetch(fetchMock)

    render(<LikeButton slug={slug} />)

    expect(await screen.findByText('0개')).toBeInTheDocument()
  })

  it('로딩 중에는 버튼이 disabled 상태여야 한다', async () => {
    let resolvePost: (value: unknown) => void

    const fetchMock = jest
      .fn()
      // 초기 GET
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likes: 0 }),
      })
      // POST (지연)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolvePost = resolve
          })
      )

    mockFetch(fetchMock)

    render(<LikeButton slug={slug} />)

    const button = await screen.findByRole('button', { name: '좋아요 추가' })

    fireEvent.click(button)
    expect(button).toBeDisabled()

    // POST 응답 해제
    resolvePost?.({
      ok: true,
      json: async () => ({ likes: 1 }),
    })

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })
})

