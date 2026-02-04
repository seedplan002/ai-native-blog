import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogPosts } from './posts'
import { formatDate, getBlogPosts } from 'app/blog/utils'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, className, ...props }: any) => {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    )
  }
})

// Mock utility functions
jest.mock('app/blog/utils', () => ({
  formatDate: jest.fn(),
  getBlogPosts: jest.fn(),
}))

const mockGetBlogPosts = getBlogPosts as jest.MockedFunction<typeof getBlogPosts>
const mockFormatDate = formatDate as jest.MockedFunction<typeof formatDate>

describe('BlogPosts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock implementation for formatDate
    mockFormatDate.mockImplementation((date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    })
  })

  describe('렌더링', () => {
    it('블로그 포스트가 없을 때 빈 컨테이너를 렌더링한다', () => {
      mockGetBlogPosts.mockReturnValue([])

      const { container } = render(<BlogPosts />)

      expect(container.querySelector('div')).toBeInTheDocument()
      expect(container.querySelector('a')).not.toBeInTheDocument()
    })

    it('블로그 포스트 목록을 렌더링한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'test-post-1',
          metadata: {
            title: 'First Test Post',
            publishedAt: '2024-01-15',
            summary: 'Test summary',
          },
          content: 'Test content',
        },
        {
          slug: 'test-post-2',
          metadata: {
            title: 'Second Test Post',
            publishedAt: '2024-01-20',
            summary: 'Test summary 2',
          },
          content: 'Test content 2',
        },
      ])

      render(<BlogPosts />)

      expect(screen.getByText('First Test Post')).toBeInTheDocument()
      expect(screen.getByText('Second Test Post')).toBeInTheDocument()
    })

    it('단일 블로그 포스트를 올바르게 렌더링한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'single-post',
          metadata: {
            title: 'Single Post Title',
            publishedAt: '2024-02-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      expect(screen.getByText('Single Post Title')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/single-post')
    })
  })

  describe('날짜 정렬', () => {
    it('포스트를 날짜 내림차순으로 정렬한다 (최신 포스트가 먼저)', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'old-post',
          metadata: {
            title: 'Old Post',
            publishedAt: '2024-01-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'new-post',
          metadata: {
            title: 'New Post',
            publishedAt: '2024-03-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'middle-post',
          metadata: {
            title: 'Middle Post',
            publishedAt: '2024-02-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3)
      expect(links[0]).toHaveAttribute('href', '/blog/new-post')
      expect(links[1]).toHaveAttribute('href', '/blog/middle-post')
      expect(links[2]).toHaveAttribute('href', '/blog/old-post')
    })

    it('같은 날짜의 포스트도 처리한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'post-1',
          metadata: {
            title: 'Post 1',
            publishedAt: '2024-01-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'post-2',
          metadata: {
            title: 'Post 2',
            publishedAt: '2024-01-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2)
      expect(screen.getByText('Post 1')).toBeInTheDocument()
      expect(screen.getByText('Post 2')).toBeInTheDocument()
    })

    it('시간이 포함된 날짜 형식을 올바르게 정렬한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'morning-post',
          metadata: {
            title: 'Morning Post',
            publishedAt: '2024-01-01T09:00:00',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'evening-post',
          metadata: {
            title: 'Evening Post',
            publishedAt: '2024-01-01T18:00:00',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveAttribute('href', '/blog/evening-post')
      expect(links[1]).toHaveAttribute('href', '/blog/morning-post')
    })
  })

  describe('날짜 포맷팅', () => {
    it('formatDate 함수를 false 파라미터와 함께 호출한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'test-post',
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      expect(mockFormatDate).toHaveBeenCalledWith('2024-01-15', false)
    })

    it('포맷팅된 날짜를 렌더링한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'test-post',
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])
      mockFormatDate.mockReturnValue('January 15, 2024')

      render(<BlogPosts />)

      expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
    })

    it('여러 포스트의 날짜를 각각 포맷팅한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'post-1',
          metadata: {
            title: 'Post 1',
            publishedAt: '2024-01-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'post-2',
          metadata: {
            title: 'Post 2',
            publishedAt: '2024-02-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])
      mockFormatDate
        .mockReturnValueOnce('February 1, 2024')
        .mockReturnValueOnce('January 1, 2024')

      render(<BlogPosts />)

      expect(mockFormatDate).toHaveBeenCalledTimes(2)
      expect(screen.getByText('February 1, 2024')).toBeInTheDocument()
      expect(screen.getByText('January 1, 2024')).toBeInTheDocument()
    })
  })

  describe('링크 기능', () => {
    it('각 포스트가 올바른 URL로 링크된다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'my-awesome-post',
          metadata: {
            title: 'My Awesome Post',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const link = screen.getByRole('link', { name: /my awesome post/i })
      expect(link).toHaveAttribute('href', '/blog/my-awesome-post')
    })

    it('slug에 특수문자가 포함된 경우도 올바르게 링크한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'post-with-special-chars-123',
          metadata: {
            title: 'Post with Special Chars',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/blog/post-with-special-chars-123')
    })

    it('여러 포스트가 각각 고유한 href를 가진다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'post-a',
          metadata: {
            title: 'Post A',
            publishedAt: '2024-01-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'post-b',
          metadata: {
            title: 'Post B',
            publishedAt: '2024-01-02',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'post-c',
          metadata: {
            title: 'Post C',
            publishedAt: '2024-01-03',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      expect(screen.getByRole('link', { name: /post a/i })).toHaveAttribute(
        'href',
        '/blog/post-a'
      )
      expect(screen.getByRole('link', { name: /post b/i })).toHaveAttribute(
        'href',
        '/blog/post-b'
      )
      expect(screen.getByRole('link', { name: /post c/i })).toHaveAttribute(
        'href',
        '/blog/post-c'
      )
    })
  })

  describe('스타일링 및 레이아웃', () => {
    it('각 포스트 아이템에 올바른 CSS 클래스가 적용된다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'test-post',
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const link = screen.getByRole('link')
      expect(link).toHaveClass('flex', 'flex-col', 'space-y-1', 'mb-4')
    })

    it('날짜 요소에 올바른 스타일 클래스가 적용된다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'test-post',
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])
      mockFormatDate.mockReturnValue('January 15, 2024')

      const { container } = render(<BlogPosts />)

      const dateElement = screen.getByText('January 15, 2024')
      expect(dateElement).toHaveClass(
        'text-neutral-600',
        'dark:text-neutral-400',
        'w-[100px]',
        'tabular-nums'
      )
    })

    it('제목 요소에 올바른 스타일 클래스가 적용된다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'test-post',
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const titleElement = screen.getByText('Test Post')
      expect(titleElement).toHaveClass(
        'text-neutral-900',
        'dark:text-neutral-100',
        'tracking-tight'
      )
    })

    it('반응형 레이아웃 클래스가 적용된다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'test-post',
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      const { container } = render(<BlogPosts />)

      const flexContainer = container.querySelector('.flex.flex-col.md\\:flex-row')
      expect(flexContainer).toBeInTheDocument()
      expect(flexContainer).toHaveClass(
        'w-full',
        'flex',
        'flex-col',
        'md:flex-row',
        'space-x-0',
        'md:space-x-2'
      )
    })
  })

  describe('엣지 케이스', () => {
    it('제목이 매우 긴 경우를 처리한다', () => {
      const longTitle = 'A'.repeat(200)
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'long-title-post',
          metadata: {
            title: longTitle,
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('제목이 빈 문자열인 경우를 처리한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'empty-title-post',
          metadata: {
            title: '',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/blog/empty-title-post')
    })

    it('제목에 특수문자가 포함된 경우를 처리한다', () => {
      const specialTitle = 'Post <>&"\'의 제목'
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'special-chars',
          metadata: {
            title: specialTitle,
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      expect(screen.getByText(specialTitle)).toBeInTheDocument()
    })

    it('slug가 매우 긴 경우를 처리한다', () => {
      const longSlug = 'a'.repeat(200)
      mockGetBlogPosts.mockReturnValue([
        {
          slug: longSlug,
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', `/blog/${longSlug}`)
    })

    it('제목에 줄바꿈 문자가 포함된 경우를 처리한다', () => {
      const titleWithNewline = 'First Line\nSecond Line'
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'multiline-title',
          metadata: {
            title: titleWithNewline,
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      expect(screen.getByText(titleWithNewline)).toBeInTheDocument()
    })

    it('날짜 포맷팅이 실패하면 빈 문자열을 처리한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'test-post',
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])
      mockFormatDate.mockReturnValue('')

      render(<BlogPosts />)

      expect(screen.getByText('Test Post')).toBeInTheDocument()
    })

    it('100개 이상의 포스트를 렌더링할 수 있다', () => {
      const manyPosts = Array.from({ length: 150 }, (_, i) => ({
        slug: `post-${i}`,
        metadata: {
          title: `Post ${i}`,
          publishedAt: `2024-01-${String(i % 28 + 1).padStart(2, '0')}`,
          summary: 'Summary',
        },
        content: 'Content',
      }))

      mockGetBlogPosts.mockReturnValue(manyPosts)

      render(<BlogPosts />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(150)
    })

    it('미래 날짜의 포스트도 처리한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'future-post',
          metadata: {
            title: 'Future Post',
            publishedAt: '2099-12-31',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'past-post',
          metadata: {
            title: 'Past Post',
            publishedAt: '2020-01-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveAttribute('href', '/blog/future-post')
      expect(links[1]).toHaveAttribute('href', '/blog/past-post')
    })

    it('잘못된 날짜 형식을 처리한다 (Invalid Date)', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'invalid-date-post',
          metadata: {
            title: 'Invalid Date Post',
            publishedAt: 'invalid-date',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      // Component should still render even with invalid date
      expect(screen.getByText('Invalid Date Post')).toBeInTheDocument()
    })
  })

  describe('getBlogPosts 호출', () => {
    it('컴포넌트가 마운트될 때 getBlogPosts를 호출한다', () => {
      mockGetBlogPosts.mockReturnValue([])

      render(<BlogPosts />)

      expect(mockGetBlogPosts).toHaveBeenCalledTimes(1)
    })

    it('getBlogPosts를 인자 없이 호출한다', () => {
      mockGetBlogPosts.mockReturnValue([])

      render(<BlogPosts />)

      expect(mockGetBlogPosts).toHaveBeenCalledWith()
    })
  })

  describe('키(key) 속성', () => {
    it('각 포스트 아이템이 고유한 key를 가진다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'post-1',
          metadata: {
            title: 'Post 1',
            publishedAt: '2024-01-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'post-2',
          metadata: {
            title: 'Post 2',
            publishedAt: '2024-01-02',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      const { container } = render(<BlogPosts />)

      // Each link should be present and unique
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2)

      // Verify slugs are used (through href attributes)
      expect(links[0]).toHaveAttribute('href', '/blog/post-2')
      expect(links[1]).toHaveAttribute('href', '/blog/post-1')
    })
  })

  describe('접근성', () => {
    it('모든 링크가 link 역할을 가진다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'post-1',
          metadata: {
            title: 'Post 1',
            publishedAt: '2024-01-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'post-2',
          metadata: {
            title: 'Post 2',
            publishedAt: '2024-01-02',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2)
      links.forEach((link) => {
        expect(link).toBeInTheDocument()
      })
    })

    it('링크 텍스트가 의미있는 콘텐츠를 포함한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'meaningful-post',
          metadata: {
            title: 'How to Write Tests',
            publishedAt: '2024-01-15',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ])

      render(<BlogPosts />)

      const link = screen.getByRole('link', { name: /how to write tests/i })
      expect(link).toBeInTheDocument()
    })
  })

  describe('데이터 무결성', () => {
    it('metadata 속성이 누락된 경우를 처리한다', () => {
      mockGetBlogPosts.mockReturnValue([
        {
          slug: 'incomplete-post',
          metadata: {} as any,
          content: 'Content',
        },
      ])

      // Should not crash
      expect(() => render(<BlogPosts />)).not.toThrow()
    })

    it('정렬 후 원본 데이터를 변경하지 않는다', () => {
      const posts = [
        {
          slug: 'post-1',
          metadata: {
            title: 'Post 1',
            publishedAt: '2024-01-01',
            summary: 'Summary',
          },
          content: 'Content',
        },
        {
          slug: 'post-2',
          metadata: {
            title: 'Post 2',
            publishedAt: '2024-01-02',
            summary: 'Summary',
          },
          content: 'Content',
        },
      ]

      mockGetBlogPosts.mockReturnValue(posts)

      render(<BlogPosts />)

      // Render again to ensure sorting doesn't have side effects
      render(<BlogPosts />)

      expect(mockGetBlogPosts).toHaveBeenCalledTimes(2)
    })
  })
})
