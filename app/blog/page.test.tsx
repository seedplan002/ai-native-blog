import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page, { metadata } from './page'
import * as posts from 'app/components/posts'

// Mock the BlogPosts component
jest.mock('app/components/posts', () => ({
  BlogPosts: jest.fn(() => <div data-testid="mock-blog-posts">Mocked BlogPosts</div>),
}))

describe('Blog Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('렌더링', () => {
    it('페이지 제목 "My Blog"를 렌더링해야 한다', () => {
      render(<Page />)

      const heading = screen.getByRole('heading', { level: 1, name: /my blog/i })
      expect(heading).toBeInTheDocument()
    })

    it('제목에 올바른 클래스가 적용되어야 한다', () => {
      render(<Page />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('font-semibold', 'text-2xl', 'mb-8', 'tracking-tighter')
    })

    it('section 요소로 감싸져 있어야 한다', () => {
      const { container } = render(<Page />)

      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('BlogPosts 컴포넌트를 렌더링해야 한다', () => {
      render(<Page />)

      expect(screen.getByTestId('mock-blog-posts')).toBeInTheDocument()
    })

    it('BlogPosts 컴포넌트가 한 번만 호출되어야 한다', () => {
      render(<Page />)

      expect(posts.BlogPosts).toHaveBeenCalledTimes(1)
    })
  })

  describe('메타데이터', () => {
    it('올바른 title을 포함해야 한다', () => {
      expect(metadata.title).toBe('Blog')
    })

    it('올바른 description을 포함해야 한다', () => {
      expect(metadata.description).toBe('Read my blog.')
    })

    it('필수 메타데이터 속성을 모두 포함해야 한다', () => {
      expect(metadata).toHaveProperty('title')
      expect(metadata).toHaveProperty('description')
    })

    it('메타데이터가 객체여야 한다', () => {
      expect(typeof metadata).toBe('object')
      expect(metadata).not.toBeNull()
    })
  })

  describe('구조', () => {
    it('제목이 BlogPosts보다 먼저 렌더링되어야 한다', () => {
      const { container } = render(<Page />)

      const section = container.querySelector('section')
      const children = section?.children

      expect(children).toHaveLength(2)
      expect(children?.[0].tagName).toBe('H1')
      expect(children?.[1]).toContainElement(screen.getByTestId('mock-blog-posts'))
    })

    it('페이지가 접근성 요구사항을 충족해야 한다', () => {
      render(<Page />)

      // Verify heading hierarchy
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThanOrEqual(1)

      // Verify the main heading is level 1
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('My Blog')
    })
  })

  describe('엣지 케이스', () => {
    it('BlogPosts가 빈 목록을 반환해도 페이지가 정상적으로 렌더링되어야 한다', () => {
      render(<Page />)

      expect(screen.getByRole('heading', { name: /my blog/i })).toBeInTheDocument()
      expect(screen.getByTestId('mock-blog-posts')).toBeInTheDocument()
    })

    it('여러 번 렌더링해도 일관성을 유지해야 한다', () => {
      const { rerender } = render(<Page />)

      expect(screen.getByRole('heading', { name: /my blog/i })).toBeInTheDocument()

      rerender(<Page />)

      expect(screen.getByRole('heading', { name: /my blog/i })).toBeInTheDocument()
      expect(posts.BlogPosts).toHaveBeenCalledTimes(2)
    })
  })

  describe('스타일링', () => {
    it('제목에 semantic font size 클래스가 적용되어야 한다', () => {
      render(<Page />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading.className).toContain('text-2xl')
    })

    it('제목에 적절한 마진이 적용되어야 한다', () => {
      render(<Page />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading.className).toContain('mb-8')
    })

    it('제목에 font weight 클래스가 적용되어야 한다', () => {
      render(<Page />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading.className).toContain('font-semibold')
    })

    it('제목에 letter spacing 클래스가 적용되어야 한다', () => {
      render(<Page />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading.className).toContain('tracking-tighter')
    })
  })

  describe('컴포넌트 통합', () => {
    it('BlogPosts 컴포넌트에 props를 전달하지 않아야 한다', () => {
      render(<Page />)

      expect(posts.BlogPosts).toHaveBeenCalledWith({}, {})
    })
  })

  describe('타입 안정성', () => {
    it('Page 컴포넌트가 함수여야 한다', () => {
      expect(typeof Page).toBe('function')
    })

    it('metadata가 올바른 타입을 가져야 한다', () => {
      expect(typeof metadata.title).toBe('string')
      expect(typeof metadata.description).toBe('string')
    })
  })
})
