import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Navbar } from './nav'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
})

describe('Navbar', () => {
  describe('렌더링', () => {
    it('네비게이션 요소가 올바르게 렌더링된다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute('id', 'nav')
    })

    it('모든 네비게이션 링크가 렌더링된다', () => {
      render(<Navbar />)

      const homeLink = screen.getByRole('link', { name: 'home' })
      const blogLink = screen.getByRole('link', { name: 'blog' })
      const deployLink = screen.getByRole('link', { name: 'deploy' })

      expect(homeLink).toBeInTheDocument()
      expect(blogLink).toBeInTheDocument()
      expect(deployLink).toBeInTheDocument()
    })

    it('네비게이션이 aside 태그로 래핑되어 있다', () => {
      const { container } = render(<Navbar />)

      const aside = container.querySelector('aside')
      expect(aside).toBeInTheDocument()
      expect(aside).toHaveClass('-ml-[8px]', 'mb-16', 'tracking-tight')
    })

    it('네비게이션이 올바른 구조로 렌더링된다', () => {
      const { container } = render(<Navbar />)

      const aside = container.querySelector('aside')
      const stickyDiv = aside?.querySelector('div.lg\\:sticky')
      const nav = stickyDiv?.querySelector('nav')
      const flexDiv = nav?.querySelector('div.flex.flex-row')

      expect(stickyDiv).toBeInTheDocument()
      expect(nav).toBeInTheDocument()
      expect(flexDiv).toBeInTheDocument()
    })
  })

  describe('네비게이션 링크', () => {
    it('home 링크가 올바른 href를 가진다', () => {
      render(<Navbar />)

      const homeLink = screen.getByRole('link', { name: 'home' })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('blog 링크가 올바른 href를 가진다', () => {
      render(<Navbar />)

      const blogLink = screen.getByRole('link', { name: 'blog' })
      expect(blogLink).toHaveAttribute('href', '/blog')
    })

    it('deploy 링크가 외부 URL을 가진다', () => {
      render(<Navbar />)

      const deployLink = screen.getByRole('link', { name: 'deploy' })
      expect(deployLink).toHaveAttribute('href', 'https://vercel.com/templates/next.js/portfolio-starter-kit')
    })

    it('모든 링크가 올바른 CSS 클래스를 가진다', () => {
      render(<Navbar />)

      const links = screen.getAllByRole('link')

      links.forEach(link => {
        expect(link).toHaveClass(
          'transition-all',
          'hover:text-neutral-800',
          'dark:hover:text-neutral-200',
          'flex',
          'align-middle',
          'relative',
          'py-1',
          'px-2',
          'm-1'
        )
      })
    })

    it('정확히 3개의 링크가 렌더링된다', () => {
      render(<Navbar />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3)
    })
  })

  describe('접근성', () => {
    it('navigation role을 가진 요소가 있다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('모든 링크가 link role을 가진다', () => {
      render(<Navbar />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3)

      links.forEach(link => {
        expect(link.tagName.toLowerCase()).toBe('a')
      })
    })

    it('navigation이 의미있는 id를 가진다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('id', 'nav')
    })
  })

  describe('스타일링', () => {
    it('네비게이션이 올바른 레이아웃 클래스를 가진다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('flex', 'flex-row', 'items-start', 'relative')
    })

    it('네비게이션 컨테이너가 반응형 클래스를 가진다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('md:overflow-auto', 'md:relative')
    })

    it('링크 컨테이너가 space-x-0 클래스를 가진다', () => {
      const { container } = render(<Navbar />)

      const linkContainer = container.querySelector('div.flex.flex-row.space-x-0')
      expect(linkContainer).toBeInTheDocument()
      expect(linkContainer).toHaveClass('pr-10')
    })

    it('sticky 포지셔닝 클래스가 적용된다', () => {
      const { container } = render(<Navbar />)

      const stickyDiv = container.querySelector('div.lg\\:sticky.lg\\:top-20')
      expect(stickyDiv).toBeInTheDocument()
    })

    it('fade 클래스가 네비게이션에 적용된다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('fade')
    })
  })

  describe('링크 순서', () => {
    it('링크가 올바른 순서로 렌더링된다', () => {
      render(<Navbar />)

      const links = screen.getAllByRole('link')

      expect(links[0]).toHaveTextContent('home')
      expect(links[1]).toHaveTextContent('blog')
      expect(links[2]).toHaveTextContent('deploy')
    })

    it('링크가 올바른 href 순서를 가진다', () => {
      render(<Navbar />)

      const links = screen.getAllByRole('link')

      expect(links[0]).toHaveAttribute('href', '/')
      expect(links[1]).toHaveAttribute('href', '/blog')
      expect(links[2]).toHaveAttribute('href', 'https://vercel.com/templates/next.js/portfolio-starter-kit')
    })
  })

  describe('링크 텍스트', () => {
    it('home 링크가 올바른 텍스트를 표시한다', () => {
      render(<Navbar />)

      const homeLink = screen.getByRole('link', { name: 'home' })
      expect(homeLink).toHaveTextContent('home')
    })

    it('blog 링크가 올바른 텍스트를 표시한다', () => {
      render(<Navbar />)

      const blogLink = screen.getByRole('link', { name: 'blog' })
      expect(blogLink).toHaveTextContent('blog')
    })

    it('deploy 링크가 올바른 텍스트를 표시한다', () => {
      render(<Navbar />)

      const deployLink = screen.getByRole('link', { name: 'deploy' })
      expect(deployLink).toHaveTextContent('deploy')
    })

    it('링크 텍스트가 대소문자를 정확히 유지한다', () => {
      render(<Navbar />)

      const homeLink = screen.getByRole('link', { name: /^home$/i })
      const blogLink = screen.getByRole('link', { name: /^blog$/i })
      const deployLink = screen.getByRole('link', { name: /^deploy$/i })

      expect(homeLink.textContent).toBe('home')
      expect(blogLink.textContent).toBe('blog')
      expect(deployLink.textContent).toBe('deploy')
    })
  })

  describe('에지 케이스', () => {
    it('네비게이션이 빈 링크 없이 렌더링된다', () => {
      render(<Navbar />)

      const links = screen.getAllByRole('link')

      links.forEach(link => {
        expect(link.textContent).not.toBe('')
        expect(link.getAttribute('href')).not.toBe('')
      })
    })

    it('네비게이션이 중복된 링크 없이 렌더링된다', () => {
      render(<Navbar />)

      const links = screen.getAllByRole('link')
      const hrefs = links.map(link => link.getAttribute('href'))
      const uniqueHrefs = new Set(hrefs)

      expect(hrefs.length).toBe(uniqueHrefs.size)
    })

    it('모든 링크가 유효한 href를 가진다', () => {
      render(<Navbar />)

      const links = screen.getAllByRole('link')

      links.forEach(link => {
        const href = link.getAttribute('href')
        expect(href).toBeTruthy()
        expect(typeof href).toBe('string')
        expect(href!.length).toBeGreaterThan(0)
      })
    })

    it('네비게이션이 항상 일관된 수의 링크를 렌더링한다', () => {
      const { unmount } = render(<Navbar />)
      const firstRenderLinks = screen.getAllByRole('link')

      unmount()

      render(<Navbar />)
      const secondRenderLinks = screen.getAllByRole('link')

      expect(firstRenderLinks.length).toBe(secondRenderLinks.length)
    })
  })

  describe('DOM 구조', () => {
    it('올바른 HTML 시맨틱 구조를 가진다', () => {
      const { container } = render(<Navbar />)

      const aside = container.querySelector('aside')
      const nav = aside?.querySelector('nav')
      const links = nav?.querySelectorAll('a')

      expect(aside?.tagName.toLowerCase()).toBe('aside')
      expect(nav?.tagName.toLowerCase()).toBe('nav')
      expect(links?.length).toBe(3)
    })

    it('nav 요소가 aside 요소 내부에 있다', () => {
      const { container } = render(<Navbar />)

      const aside = container.querySelector('aside')
      const nav = screen.getByRole('navigation')

      expect(aside).toContainElement(nav)
    })

    it('모든 링크가 nav 요소 내부에 있다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      const links = within(nav).getAllByRole('link')

      expect(links).toHaveLength(3)
    })
  })

  describe('반응형 디자인', () => {
    it('네비게이션이 모바일 레이아웃 클래스를 가진다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('flex-row')
    })

    it('네비게이션이 데스크톱 레이아웃 클래스를 가진다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('md:overflow-auto', 'scroll-pr-6', 'md:relative')
    })

    it('sticky 요소가 large 스크린 클래스를 가진다', () => {
      const { container } = render(<Navbar />)

      const stickyDiv = container.querySelector('.lg\\:sticky')
      expect(stickyDiv).toBeInTheDocument()
      expect(stickyDiv).toHaveClass('lg:top-20')
    })
  })

  describe('클래스 무결성', () => {
    it('aside가 올바른 margin과 spacing 클래스를 가진다', () => {
      const { container } = render(<Navbar />)

      const aside = container.querySelector('aside')
      expect(aside).toHaveClass('-ml-[8px]', 'mb-16', 'tracking-tight')
    })

    it('nav가 올바른 padding 클래스를 가진다', () => {
      render(<Navbar />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('px-0', 'pb-0')
    })

    it('링크 컨테이너가 올바른 spacing 클래스를 가진다', () => {
      const { container } = render(<Navbar />)

      const linkContainer = container.querySelector('div.flex.flex-row.space-x-0')
      expect(linkContainer).toHaveClass('space-x-0', 'pr-10')
    })
  })
})
