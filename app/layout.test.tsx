import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RootLayout from './layout'

// Mock child components
jest.mock('./components/nav', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}))

jest.mock('./components/footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}))

// Mock Vercel Analytics and Speed Insights
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="analytics">Analytics</div>,
}))

jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="speed-insights">SpeedInsights</div>,
}))

// Mock Geist fonts
jest.mock('geist/font/sans', () => ({
  GeistSans: {
    variable: 'geist-sans-variable',
  },
}))

jest.mock('geist/font/mono', () => ({
  GeistMono: {
    variable: 'geist-mono-variable',
  },
}))

// Mock sitemap baseUrl
jest.mock('./sitemap', () => ({
  baseUrl: 'https://portfolio-blog-starter.vercel.app',
}))

// Mock global.css import
jest.mock('./global.css', () => ({}))

describe('RootLayout', () => {
  const renderLayout = (children: React.ReactNode = <div>Test Content</div>) => {
    return render(<RootLayout>{children}</RootLayout>)
  }

  describe('렌더링', () => {
    it('children prop과 함께 정상적으로 렌더링되어야 한다', () => {
      renderLayout(<div>Test Content</div>)

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('모든 필수 컴포넌트가 렌더링되어야 한다', () => {
      renderLayout()

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
      expect(screen.getByTestId('analytics')).toBeInTheDocument()
      expect(screen.getByTestId('speed-insights')).toBeInTheDocument()
    })

    it('빈 children으로 렌더링되어야 한다', () => {
      renderLayout(null)

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('여러 children 요소를 렌더링해야 한다', () => {
      renderLayout(
        <>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </>
      )

      expect(screen.getByText('First Child')).toBeInTheDocument()
      expect(screen.getByText('Second Child')).toBeInTheDocument()
      expect(screen.getByText('Third Child')).toBeInTheDocument()
    })

    it('문자열 children을 렌더링해야 한다', () => {
      renderLayout('Simple text content')

      expect(screen.getByText('Simple text content')).toBeInTheDocument()
    })

    it('숫자 children을 렌더링해야 한다', () => {
      renderLayout(<>{42}</>)

      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  describe('HTML 구조', () => {
    it('올바른 HTML 구조를 가져야 한다', () => {
      const { container } = renderLayout()

      const html = container.querySelector('html')
      const body = container.querySelector('body')
      const main = container.querySelector('main')

      expect(html).toBeInTheDocument()
      expect(body).toBeInTheDocument()
      expect(main).toBeInTheDocument()
    })

    it('html 태그에 lang 속성이 "en"이어야 한다', () => {
      const { container } = renderLayout()

      const html = container.querySelector('html')
      expect(html).toHaveAttribute('lang', 'en')
    })

    it('html 태그에 올바른 클래스가 적용되어야 한다', () => {
      const { container } = renderLayout()

      const html = container.querySelector('html')
      expect(html).toHaveClass('text-black')
      expect(html).toHaveClass('bg-white')
      expect(html).toHaveClass('dark:text-white')
      expect(html).toHaveClass('dark:bg-black')
      expect(html).toHaveClass('geist-sans-variable')
      expect(html).toHaveClass('geist-mono-variable')
    })

    it('body 태그에 올바른 클래스가 적용되어야 한다', () => {
      const { container } = renderLayout()

      const body = container.querySelector('body')
      expect(body).toHaveClass('antialiased')
      expect(body).toHaveClass('max-w-xl')
      expect(body).toHaveClass('mx-4')
      expect(body).toHaveClass('mt-8')
      expect(body).toHaveClass('lg:mx-auto')
    })

    it('main 태그에 올바른 클래스가 적용되어야 한다', () => {
      const { container } = renderLayout()

      const main = container.querySelector('main')
      expect(main).toHaveClass('flex-auto')
      expect(main).toHaveClass('min-w-0')
      expect(main).toHaveClass('mt-6')
      expect(main).toHaveClass('flex')
      expect(main).toHaveClass('flex-col')
      expect(main).toHaveClass('px-2')
      expect(main).toHaveClass('md:px-0')
    })
  })

  describe('컴포넌트 순서', () => {
    it('Navbar가 children 이전에 렌더링되어야 한다', () => {
      const { container } = renderLayout(<div data-testid="test-children">Test</div>)

      const main = container.querySelector('main')
      const children = main?.children

      expect(children?.[0]).toHaveAttribute('data-testid', 'navbar')
      expect(children?.[1]).toHaveAttribute('data-testid', 'test-children')
    })

    it('Footer가 children 이후에 렌더링되어야 한다', () => {
      const { container } = renderLayout(<div data-testid="test-children">Test</div>)

      const main = container.querySelector('main')
      const children = main?.children

      expect(children?.[1]).toHaveAttribute('data-testid', 'test-children')
      expect(children?.[2]).toHaveAttribute('data-testid', 'footer')
    })

    it('Analytics와 SpeedInsights가 Footer 이후에 렌더링되어야 한다', () => {
      const { container } = renderLayout()

      const main = container.querySelector('main')
      const children = main?.children

      expect(children?.[2]).toHaveAttribute('data-testid', 'footer')
      expect(children?.[3]).toHaveAttribute('data-testid', 'analytics')
      expect(children?.[4]).toHaveAttribute('data-testid', 'speed-insights')
    })
  })

  describe('엣지 케이스', () => {
    it('매우 긴 텍스트 children을 렌더링해야 한다', () => {
      const longText = 'A'.repeat(10000)
      renderLayout(<div>{longText}</div>)

      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('특수 문자가 포함된 children을 렌더링해야 한다', () => {
      const specialChars = '<>{}[]()!@#$%^&*'
      renderLayout(<div>{specialChars}</div>)

      expect(screen.getByText(specialChars)).toBeInTheDocument()
    })

    it('유니코드 문자가 포함된 children을 렌더링해야 한다', () => {
      const unicodeText = '한글 テスト 🚀 emoji'
      renderLayout(<div>{unicodeText}</div>)

      expect(screen.getByText(unicodeText)).toBeInTheDocument()
    })

    it('깊게 중첩된 children을 렌더링해야 한다', () => {
      renderLayout(
        <div>
          <div>
            <div>
              <div>
                <div>Deeply nested content</div>
              </div>
            </div>
          </div>
        </div>
      )

      expect(screen.getByText('Deeply nested content')).toBeInTheDocument()
    })

    it('false, undefined, null children을 처리해야 한다', () => {
      renderLayout(
        <>
          {false}
          {undefined}
          {null}
          <div>Visible content</div>
        </>
      )

      expect(screen.getByText('Visible content')).toBeInTheDocument()
    })

    it('배열 형태의 children을 렌더링해야 한다', () => {
      const items = ['Item 1', 'Item 2', 'Item 3']
      renderLayout(
        <>
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </>
      )

      items.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })
    })

    it('조건부 렌더링된 children을 처리해야 한다', () => {
      const showContent = true
      renderLayout(
        <>
          {showContent && <div>Conditional content</div>}
          {!showContent && <div>Hidden content</div>}
        </>
      )

      expect(screen.getByText('Conditional content')).toBeInTheDocument()
      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
    })
  })

  describe('접근성', () => {
    it('시맨틱 HTML 요소를 사용해야 한다', () => {
      const { container } = renderLayout()

      expect(container.querySelector('html')).toBeInTheDocument()
      expect(container.querySelector('body')).toBeInTheDocument()
      expect(container.querySelector('main')).toBeInTheDocument()
    })

    it('lang 속성이 설정되어야 한다', () => {
      const { container } = renderLayout()

      const html = container.querySelector('html')
      expect(html).toHaveAttribute('lang')
      expect(html?.getAttribute('lang')).toBe('en')
    })
  })

  describe('스타일링', () => {
    it('다크 모드 클래스가 포함되어야 한다', () => {
      const { container } = renderLayout()

      const html = container.querySelector('html')
      expect(html?.className).toContain('dark:text-white')
      expect(html?.className).toContain('dark:bg-black')
    })

    it('폰트 변수 클래스가 포함되어야 한다', () => {
      const { container } = renderLayout()

      const html = container.querySelector('html')
      expect(html?.className).toContain('geist-sans-variable')
      expect(html?.className).toContain('geist-mono-variable')
    })

    it('반응형 클래스가 포함되어야 한다', () => {
      const { container } = renderLayout()

      const body = container.querySelector('body')
      const main = container.querySelector('main')

      expect(body?.className).toContain('lg:mx-auto')
      expect(main?.className).toContain('md:px-0')
    })
  })

  describe('컴포넌트 통합', () => {
    it('Navbar 컴포넌트가 렌더링되어야 한다', () => {
      renderLayout()

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByText('Navbar')).toBeInTheDocument()
    })

    it('Footer 컴포넌트가 렌더링되어야 한다', () => {
      renderLayout()

      expect(screen.getByTestId('footer')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('Analytics 컴포넌트가 렌더링되어야 한다', () => {
      renderLayout()

      expect(screen.getByTestId('analytics')).toBeInTheDocument()
    })

    it('SpeedInsights 컴포넌트가 렌더링되어야 한다', () => {
      renderLayout()

      expect(screen.getByTestId('speed-insights')).toBeInTheDocument()
    })
  })
})
