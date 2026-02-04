import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page from './page'
import { getBlogPosts } from './blog/utils'

// Mock the BlogPosts component's dependency
jest.mock('./blog/utils', () => ({
  getBlogPosts: jest.fn(),
  formatDate: jest.fn((date: string) => {
    const d = new Date(date)
    return d.toLocaleString('en-us', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }),
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('렌더링', () => {
    it('포트폴리오 제목을 렌더링한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      const heading = screen.getByRole('heading', { level: 1, name: 'My Portfolio' })
      expect(heading).toBeInTheDocument()
    })

    it('소개 텍스트를 렌더링한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      const introText = screen.getByText(/I'm a Vim enthusiast and tab advocate/i)
      expect(introText).toBeInTheDocument()
      expect(introText).toHaveTextContent(
        "I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in Vim's keystroke commands and tabs' flexibility for personal viewing preferences. This extends to my support for static typing, where its early error detection ensures cleaner code, and my preference for dark mode, which eases long coding sessions by reducing eye strain."
      )
    })

    it('section 요소로 래핑되어 있다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      const { container } = render(<Page />)

      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('BlogPosts 컴포넌트를 렌더링한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      const { container } = render(<Page />)

      // BlogPosts는 div로 렌더링되므로 그 구조 확인
      const blogPostsContainer = container.querySelector('section > div')
      expect(blogPostsContainer).toBeInTheDocument()
    })
  })

  describe('BlogPosts 통합', () => {
    it('블로그 포스트가 없을 때 빈 목록을 렌더링한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      // 링크가 없어야 함
      const links = screen.queryAllByRole('link')
      expect(links).toHaveLength(0)
    })

    it('블로그 포스트가 1개일 때 올바르게 렌더링한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([
        {
          slug: 'test-post',
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
          },
        },
      ])

      render(<Page />)

      const postLink = screen.getByRole('link', { name: /Test Post/i })
      expect(postLink).toBeInTheDocument()
      expect(postLink).toHaveAttribute('href', '/blog/test-post')
    })

    it('여러 블로그 포스트를 렌더링한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([
        {
          slug: 'first-post',
          metadata: {
            title: 'First Post',
            publishedAt: '2024-01-15',
          },
        },
        {
          slug: 'second-post',
          metadata: {
            title: 'Second Post',
            publishedAt: '2024-01-20',
          },
        },
        {
          slug: 'third-post',
          metadata: {
            title: 'Third Post',
            publishedAt: '2024-01-10',
          },
        },
      ])

      render(<Page />)

      expect(screen.getByRole('link', { name: /First Post/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Second Post/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Third Post/i })).toBeInTheDocument()
    })

    it('블로그 포스트가 날짜 내림차순으로 정렬된다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([
        {
          slug: 'old-post',
          metadata: {
            title: 'Old Post',
            publishedAt: '2024-01-10',
          },
        },
        {
          slug: 'newest-post',
          metadata: {
            title: 'Newest Post',
            publishedAt: '2024-01-20',
          },
        },
        {
          slug: 'middle-post',
          metadata: {
            title: 'Middle Post',
            publishedAt: '2024-01-15',
          },
        },
      ])

      render(<Page />)

      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveTextContent('Newest Post')
      expect(links[1]).toHaveTextContent('Middle Post')
      expect(links[2]).toHaveTextContent('Old Post')
    })
  })

  describe('레이아웃 및 스타일', () => {
    it('제목에 올바른 CSS 클래스가 적용된다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('mb-8', 'text-2xl', 'font-semibold', 'tracking-tighter')
    })

    it('소개 문단에 올바른 CSS 클래스가 적용된다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      const paragraph = screen.getByText(/I'm a Vim enthusiast/i)
      expect(paragraph).toHaveClass('mb-4')
    })

    it('BlogPosts 컨테이너에 올바른 CSS 클래스가 적용된다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      const { container } = render(<Page />)

      const blogPostsContainer = container.querySelector('section > div')
      expect(blogPostsContainer).toHaveClass('my-8')
    })
  })

  describe('엣지 케이스', () => {
    it('매우 긴 포스트 제목을 처리한다', () => {
      const longTitle = 'A'.repeat(200)
      ;(getBlogPosts as jest.Mock).mockReturnValue([
        {
          slug: 'long-title-post',
          metadata: {
            title: longTitle,
            publishedAt: '2024-01-15',
          },
        },
      ])

      render(<Page />)

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('특수 문자가 포함된 포스트 제목을 처리한다', () => {
      const specialTitle = 'Test & <Special> "Characters" \'Post\''
      ;(getBlogPosts as jest.Mock).mockReturnValue([
        {
          slug: 'special-chars',
          metadata: {
            title: specialTitle,
            publishedAt: '2024-01-15',
          },
        },
      ])

      render(<Page />)

      expect(screen.getByText(specialTitle)).toBeInTheDocument()
    })

    it('다양한 날짜 형식을 처리한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([
        {
          slug: 'iso-date',
          metadata: {
            title: 'ISO Date Post',
            publishedAt: '2024-01-15T10:30:00Z',
          },
        },
        {
          slug: 'simple-date',
          metadata: {
            title: 'Simple Date Post',
            publishedAt: '2024-01-15',
          },
        },
      ])

      render(<Page />)

      expect(screen.getByText('ISO Date Post')).toBeInTheDocument()
      expect(screen.getByText('Simple Date Post')).toBeInTheDocument()
    })

    it('slug에 특수 문자가 포함된 경우를 처리한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([
        {
          slug: 'post-with-dashes-and-numbers-123',
          metadata: {
            title: 'Post With Special Slug',
            publishedAt: '2024-01-15',
          },
        },
      ])

      render(<Page />)

      const link = screen.getByRole('link', { name: /Post With Special Slug/i })
      expect(link).toHaveAttribute('href', '/blog/post-with-dashes-and-numbers-123')
    })

    it('대량의 블로그 포스트를 렌더링한다', () => {
      const manyPosts = Array.from({ length: 100 }, (_, i) => ({
        slug: `post-${i}`,
        metadata: {
          title: `Post ${i}`,
          publishedAt: `2024-01-${String(i % 28 + 1).padStart(2, '0')}`,
        },
      }))

      ;(getBlogPosts as jest.Mock).mockReturnValue(manyPosts)

      render(<Page />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(100)
    })
  })

  describe('접근성', () => {
    it('의미론적 HTML을 사용한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      const { container } = render(<Page />)

      expect(container.querySelector('section')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('제목이 올바른 계층 구조를 가진다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('My Portfolio')
    })

    it('링크에 올바른 href 속성이 있다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([
        {
          slug: 'test-post',
          metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-15',
          },
        },
      ])

      render(<Page />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/blog/test-post')
    })
  })

  describe('콘텐츠 정확성', () => {
    it('PORTFOLIO_TITLE 상수 값을 정확히 렌더링한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Portfolio')
    })

    it('INTRODUCTION_TEXT 상수 값을 정확히 렌더링한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      const expectedText =
        "I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in Vim's keystroke commands and tabs' flexibility for personal viewing preferences. This extends to my support for static typing, where its early error detection ensures cleaner code, and my preference for dark mode, which eases long coding sessions by reducing eye strain."

      expect(screen.getByText(expectedText)).toBeInTheDocument()
    })
  })

  describe('getBlogPosts 호출', () => {
    it('getBlogPosts를 한 번만 호출한다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      expect(getBlogPosts).toHaveBeenCalledTimes(1)
    })

    it('getBlogPosts에 인자를 전달하지 않는다', () => {
      ;(getBlogPosts as jest.Mock).mockReturnValue([])

      render(<Page />)

      expect(getBlogPosts).toHaveBeenCalledWith()
    })
  })
})
