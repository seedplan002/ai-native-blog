import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { notFound } from 'next/navigation'
import Blog, { generateStaticParams, generateMetadata } from './page'
import { getBlogPosts, formatDate } from 'app/blog/utils'
import { getAuthor } from 'app/blog/authors'
import { CustomMDX } from 'app/components/mdx'
import { AuthorProfile } from 'app/components/author-profile'
import { baseUrl } from 'app/sitemap'

jest.mock('app/components/view-count', () => ({
  ViewCount: ({ slug }: { slug: string }) => (
    <span data-testid={`view-count-${slug}`}>조회수 컴포넌트</span>
  ),
}))

// Mock dependencies
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('app/blog/utils', () => ({
  getBlogPosts: jest.fn(),
  formatDate: jest.fn((date) => `Formatted: ${date}`),
}))

jest.mock('app/blog/authors', () => ({
  getAuthor: jest.fn(),
}))

jest.mock('app/components/mdx', () => ({
  CustomMDX: jest.fn(() => <div data-testid="custom-mdx">MDX Content</div>),
}))

jest.mock('app/components/author-profile', () => ({
  AuthorProfile: jest.fn(() => <div data-testid="author-profile">Author Profile</div>),
}))

jest.mock('app/sitemap', () => ({
  baseUrl: 'https://test-blog.com',
}))

const mockGetBlogPosts = getBlogPosts as jest.MockedFunction<typeof getBlogPosts>
const mockGetAuthor = getAuthor as jest.MockedFunction<typeof getAuthor>
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>
const mockCustomMDX = CustomMDX as jest.MockedFunction<typeof CustomMDX>
const mockAuthorProfile = AuthorProfile as jest.MockedFunction<typeof AuthorProfile>

describe('Blog Page Component', () => {
  const mockPost = {
    slug: 'test-post',
    content: '# Test Content\n\nThis is a test post.',
    metadata: {
      title: 'Test Post Title',
      publishedAt: '2024-01-15',
      summary: 'This is a test summary',
      author: 'Test Author',
    },
  }

  const mockAuthor = {
    name: 'Test Author',
    bio: '테스트 작가입니다.',
    avatar: '/authors/test-author.png',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetBlogPosts.mockReturnValue([mockPost])
    mockGetAuthor.mockReturnValue(mockAuthor)
  })

  describe('generateStaticParams', () => {
    it('포스트 목록에서 slug 배열을 생성해야 한다', () => {
      const multiplePosts = [
        { ...mockPost, slug: 'post-1' },
        { ...mockPost, slug: 'post-2' },
        { ...mockPost, slug: 'post-3' },
      ]
      mockGetBlogPosts.mockReturnValue(multiplePosts)

      const result = generateStaticParams()

      expect(result).toEqual([
        { slug: 'post-1' },
        { slug: 'post-2' },
        { slug: 'post-3' },
      ])
      expect(getBlogPosts).toHaveBeenCalledTimes(1)
    })

    it('포스트가 없을 때 빈 배열을 반환해야 한다', () => {
      mockGetBlogPosts.mockReturnValue([])

      const result = generateStaticParams()

      expect(result).toEqual([])
    })

    it('단일 포스트가 있을 때 하나의 slug를 반환해야 한다', () => {
      const result = generateStaticParams()

      expect(result).toEqual([{ slug: 'test-post' }])
    })
  })

  describe('generateMetadata', () => {
    it('포스트 메타데이터를 올바르게 생성해야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      const metadata = await generateMetadata({ params })

      expect(metadata).toEqual({
        title: 'Test Post Title',
        description: 'This is a test summary',
        openGraph: {
          title: 'Test Post Title',
          description: 'This is a test summary',
          type: 'article',
          publishedTime: '2024-01-15',
          url: 'https://test-blog.com/blog/test-post',
          images: [{ url: 'https://test-blog.com/og?title=Test%20Post%20Title' }],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Test Post Title',
          description: 'This is a test summary',
          images: ['https://test-blog.com/og?title=Test%20Post%20Title'],
        },
      })
    })

    it('커스텀 이미지가 있을 때 해당 이미지를 사용해야 한다', async () => {
      const postWithImage = {
        ...mockPost,
        metadata: {
          ...mockPost.metadata,
          image: '/custom-image.jpg',
        },
      }
      mockGetBlogPosts.mockReturnValue([postWithImage])
      const params = Promise.resolve({ slug: 'test-post' })

      const metadata = await generateMetadata({ params })

      expect(metadata?.openGraph.images).toEqual([{ url: '/custom-image.jpg' }])
      expect(metadata?.twitter.images).toEqual(['/custom-image.jpg'])
    })

    it('포스트를 찾을 수 없을 때 undefined를 반환해야 한다', async () => {
      mockGetBlogPosts.mockReturnValue([])
      const params = Promise.resolve({ slug: 'non-existent' })

      const metadata = await generateMetadata({ params })

      expect(metadata).toBeUndefined()
    })

    it('특수 문자가 포함된 제목을 올바르게 인코딩해야 한다', async () => {
      const postWithSpecialChars = {
        ...mockPost,
        metadata: {
          ...mockPost.metadata,
          title: 'Test & Special <Characters>',
        },
      }
      mockGetBlogPosts.mockReturnValue([postWithSpecialChars])
      const params = Promise.resolve({ slug: 'test-post' })

      const metadata = await generateMetadata({ params })

      expect(metadata?.openGraph.images[0].url).toContain('Test%20%26%20Special%20%3CCharacters%3E')
    })

    it('빈 문자열 제목을 처리해야 한다', async () => {
      const postWithEmptyTitle = {
        ...mockPost,
        metadata: {
          ...mockPost.metadata,
          title: '',
        },
      }
      mockGetBlogPosts.mockReturnValue([postWithEmptyTitle])
      const params = Promise.resolve({ slug: 'test-post' })

      const metadata = await generateMetadata({ params })

      expect(metadata?.title).toBe('')
      expect(metadata?.openGraph.title).toBe('')
    })
  })

  describe('Blog Component - 렌더링', () => {
    it('포스트가 존재할 때 모든 섹션을 렌더링해야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      expect(screen.getByText('Test Post Title')).toBeInTheDocument()
      expect(screen.getByTestId('custom-mdx')).toBeInTheDocument()
      expect(screen.getByTestId('author-profile')).toBeInTheDocument()
    })

    it('포스트가 없을 때 notFound를 호출해야 한다', async () => {
      mockGetBlogPosts.mockReturnValue([])
      const params = Promise.resolve({ slug: 'non-existent' })

      await Blog({ params })

      expect(mockNotFound).toHaveBeenCalledTimes(1)
    })

    it('제목을 올바른 클래스와 함께 렌더링해야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      const title = screen.getByText('Test Post Title')
      expect(title).toHaveClass('title', 'font-semibold', 'text-2xl', 'tracking-tighter')
      expect(title.tagName).toBe('H1')
    })

    it('formatDate 함수를 호출하여 날짜를 표시해야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      expect(formatDate).toHaveBeenCalledWith('2024-01-15')
      expect(screen.getByText('Formatted: 2024-01-15')).toBeInTheDocument()
    })

    it('CustomMDX 컴포넌트에 올바른 content를 전달해야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      expect(mockCustomMDX).toHaveBeenCalledWith(
        expect.objectContaining({ source: '# Test Content\n\nThis is a test post.' }),
        expect.anything()
      )
    })

    it('AuthorProfile 컴포넌트에 올바른 author를 전달해야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      expect(mockAuthorProfile).toHaveBeenCalledWith(
        expect.objectContaining({ author: mockAuthor }),
        expect.anything()
      )
    })

    it('getAuthor를 포스트 메타데이터의 author로 호출해야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      expect(getAuthor).toHaveBeenCalledWith('Test Author')
    })
  })

  describe('Blog Component - Structured Data', () => {
    it('올바른 구조화된 데이터 스크립트를 렌더링해야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      const { container } = render(await Blog({ params }))

      const script = container.querySelector('script[type="application/ld+json"]')
      expect(script).toBeInTheDocument()

      const jsonLd = JSON.parse(script?.textContent || '{}')
      expect(jsonLd).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Test Post Title',
        datePublished: '2024-01-15',
        dateModified: '2024-01-15',
        description: 'This is a test summary',
        image: '/og?title=Test%20Post%20Title',
        url: 'https://test-blog.com/blog/test-post',
        author: {
          '@type': 'Person',
          name: 'Test Author',
        },
      })
    })

    it('커스텀 이미지가 있을 때 구조화된 데이터에 baseUrl을 포함해야 한다', async () => {
      const postWithImage = {
        ...mockPost,
        metadata: {
          ...mockPost.metadata,
          image: '/custom-image.jpg',
        },
      }
      mockGetBlogPosts.mockReturnValue([postWithImage])
      const params = Promise.resolve({ slug: 'test-post' })

      const { container } = render(await Blog({ params }))

      const script = container.querySelector('script[type="application/ld+json"]')
      const jsonLd = JSON.parse(script?.textContent || '{}')
      expect(jsonLd.image).toBe('https://test-blog.com/custom-image.jpg')
    })

    it('suppressHydrationWarning 속성이 있어야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      const { container } = render(await Blog({ params }))

      const script = container.querySelector('script[type="application/ld+json"]')
      expect(script?.hasAttribute('suppresshydrationwarning')).toBe(true)
    })
  })

  describe('Blog Component - Edge Cases', () => {
    it('매우 긴 제목을 처리해야 한다', async () => {
      const longTitle = 'A'.repeat(500)
      const postWithLongTitle = {
        ...mockPost,
        metadata: {
          ...mockPost.metadata,
          title: longTitle,
        },
      }
      mockGetBlogPosts.mockReturnValue([postWithLongTitle])
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('매우 긴 콘텐츠를 처리해야 한다', async () => {
      const longContent = '# Heading\n\n' + 'Lorem ipsum '.repeat(1000)
      const postWithLongContent = {
        ...mockPost,
        content: longContent,
      }
      mockGetBlogPosts.mockReturnValue([postWithLongContent])
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      expect(mockCustomMDX).toHaveBeenCalledWith(
        expect.objectContaining({ source: longContent }),
        expect.anything()
      )
    })

    it('특수 문자가 포함된 slug를 처리해야 한다', async () => {
      const specialSlug = 'test-post-with-special-chars-123'
      const postWithSpecialSlug = {
        ...mockPost,
        slug: specialSlug,
      }
      mockGetBlogPosts.mockReturnValue([postWithSpecialSlug])
      const params = Promise.resolve({ slug: specialSlug })

      render(await Blog({ params }))

      expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    })

    it('빈 summary를 처리해야 한다', async () => {
      const postWithEmptySummary = {
        ...mockPost,
        metadata: {
          ...mockPost.metadata,
          summary: '',
        },
      }
      mockGetBlogPosts.mockReturnValue([postWithEmptySummary])
      const params = Promise.resolve({ slug: 'test-post' })

      const { container } = render(await Blog({ params }))

      const script = container.querySelector('script[type="application/ld+json"]')
      const jsonLd = JSON.parse(script?.textContent || '{}')
      expect(jsonLd.description).toBe('')
    })

    it('author가 없을 때 getAuthor를 undefined로 호출해야 한다', async () => {
      const postWithoutAuthor = {
        ...mockPost,
        metadata: {
          title: 'Test Post Title',
          publishedAt: '2024-01-15',
          summary: 'This is a test summary',
          author: '',
        },
      }
      mockGetBlogPosts.mockReturnValue([postWithoutAuthor])
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      expect(getAuthor).toHaveBeenCalledWith('')
    })

    it('날짜 형식이 다양한 경우를 처리해야 한다', async () => {
      const differentDateFormats = [
        '2024-01-15T10:30:00',
        '2024-01-15',
        '2024-01-15T00:00:00Z',
      ]

      for (const dateFormat of differentDateFormats) {
        jest.clearAllMocks()
        const postWithDate = {
          ...mockPost,
          metadata: {
            ...mockPost.metadata,
            publishedAt: dateFormat,
          },
        }
        mockGetBlogPosts.mockReturnValue([postWithDate])
        const params = Promise.resolve({ slug: 'test-post' })

        render(await Blog({ params }))

        expect(formatDate).toHaveBeenCalledWith(dateFormat)
      }
    })

    it('빈 content를 처리해야 한다', async () => {
      const postWithEmptyContent = {
        ...mockPost,
        content: '',
      }
      mockGetBlogPosts.mockReturnValue([postWithEmptyContent])
      const params = Promise.resolve({ slug: 'test-post' })

      render(await Blog({ params }))

      expect(mockCustomMDX).toHaveBeenCalledWith(
        expect.objectContaining({ source: '' }),
        expect.anything()
      )
    })
  })

  describe('Blog Component - 섹션 구조', () => {
    it('section 엘리먼트로 래핑되어야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      const { container } = render(await Blog({ params }))

      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('article 엘리먼트에 prose 클래스가 있어야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      const { container } = render(await Blog({ params }))

      const article = container.querySelector('article')
      expect(article).toHaveClass('prose')
    })

    it('날짜 텍스트에 올바른 스타일 클래스가 적용되어야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-post' })

      const { container } = render(await Blog({ params }))

      const dateElement = screen.getByText('Formatted: 2024-01-15')
      expect(dateElement).toHaveClass('text-sm', 'text-neutral-600', 'dark:text-neutral-400')
    })
  })

  describe('Blog Component - 다중 포스트 시나리오', () => {
    it('여러 포스트 중 올바른 포스트를 찾아야 한다', async () => {
      const multiplePosts = [
        { ...mockPost, slug: 'post-1', metadata: { ...mockPost.metadata, title: 'Post 1' } },
        { ...mockPost, slug: 'post-2', metadata: { ...mockPost.metadata, title: 'Post 2' } },
        { ...mockPost, slug: 'post-3', metadata: { ...mockPost.metadata, title: 'Post 3' } },
      ]
      mockGetBlogPosts.mockReturnValue(multiplePosts)
      const params = Promise.resolve({ slug: 'post-2' })

      render(await Blog({ params }))

      expect(screen.getByText('Post 2')).toBeInTheDocument()
      expect(screen.queryByText('Post 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Post 3')).not.toBeInTheDocument()
    })

    it('마지막 포스트를 올바르게 렌더링해야 한다', async () => {
      const multiplePosts = [
        { ...mockPost, slug: 'first' },
        { ...mockPost, slug: 'last', metadata: { ...mockPost.metadata, title: 'Last Post' } },
      ]
      mockGetBlogPosts.mockReturnValue(multiplePosts)
      const params = Promise.resolve({ slug: 'last' })

      render(await Blog({ params }))

      expect(screen.getByText('Last Post')).toBeInTheDocument()
    })
  })

  describe('URL 생성', () => {
    it('OpenGraph URL이 올바르게 생성되어야 한다', async () => {
      const params = Promise.resolve({ slug: 'my-awesome-post' })
      mockGetBlogPosts.mockReturnValue([
        { ...mockPost, slug: 'my-awesome-post' },
      ])

      const metadata = await generateMetadata({ params })

      expect(metadata?.openGraph.url).toBe('https://test-blog.com/blog/my-awesome-post')
    })

    it('구조화된 데이터의 URL이 올바르게 생성되어야 한다', async () => {
      const params = Promise.resolve({ slug: 'test-slug' })
      mockGetBlogPosts.mockReturnValue([
        { ...mockPost, slug: 'test-slug' },
      ])

      const { container } = render(await Blog({ params }))

      const script = container.querySelector('script[type="application/ld+json"]')
      const jsonLd = JSON.parse(script?.textContent || '{}')
      expect(jsonLd.url).toBe('https://test-blog.com/blog/test-slug')
    })
  })
})
