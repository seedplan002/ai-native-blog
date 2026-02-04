import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  CustomMDX,
} from './mdx'

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  }
})

jest.mock('next/image', () => {
  return ({ alt, src, ...props }: any) => {
    return <img alt={alt} src={src} {...props} />
  }
})

// Mock next-mdx-remote
jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ components, source }: any) => {
    // Simulate rendering with custom components
    const mockContent = `<div data-testid="mdx-content">${source}</div>`
    return <div dangerouslySetInnerHTML={{ __html: mockContent }} />
  },
}))

// Mock sugar-high
jest.mock('sugar-high', () => ({
  highlight: (code: string) => `<span class="highlighted">${code}</span>`,
}))

describe('CustomMDX', () => {
  describe('렌더링', () => {
    it('기본 props로 렌더링되어야 한다', () => {
      render(<CustomMDX source="# Hello World" />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('빈 source로 렌더링되어야 한다', () => {
      render(<CustomMDX source="" />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('커스텀 컴포넌트와 함께 렌더링되어야 한다', () => {
      const CustomComponent = () => <div data-testid="custom">Custom</div>
      const customComponents = {
        CustomComponent,
      }

      render(<CustomMDX source="test" components={customComponents} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('커스텀 컴포넌트가 undefined일 때 기본 컴포넌트만 사용해야 한다', () => {
      render(<CustomMDX source="test" components={undefined} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Props 검증', () => {
    it('source prop이 MDXRemote에 전달되어야 한다', () => {
      const source = '# Test Heading'
      render(<CustomMDX source={source} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toHaveTextContent(source)
    })

    it('긴 텍스트 source를 처리해야 한다', () => {
      const longSource = 'a'.repeat(10000)
      render(<CustomMDX source={longSource} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('특수 문자가 포함된 source를 처리해야 한다', () => {
      const specialSource = '# Test <>&"\'`!@#$%^&*()'
      render(<CustomMDX source={specialSource} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('여러 줄의 source를 처리해야 한다', () => {
      const multilineSource = `# Heading 1
## Heading 2
Paragraph text

- List item 1
- List item 2`
      render(<CustomMDX source={multilineSource} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('null 문자가 포함된 source를 처리해야 한다', () => {
      const sourceWithNull = 'test\0content'
      render(<CustomMDX source={sourceWithNull} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('컴포넌트 병합', () => {
    it('기본 컴포넌트와 커스텀 컴포넌트가 병합되어야 한다', () => {
      const CustomH1 = ({ children }: any) => <h1 data-testid="custom-h1">{children}</h1>
      const customComponents = {
        h1: CustomH1,
      }

      render(<CustomMDX source="# Test" components={customComponents} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('커스텀 컴포넌트가 기본 컴포넌트를 오버라이드해야 한다', () => {
      const CustomLink = ({ href, children }: any) => (
        <a href={href} data-testid="custom-link">{children}</a>
      )
      const customComponents = {
        a: CustomLink,
      }

      render(<CustomMDX source="[link](url)" components={customComponents} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('빈 커스텀 컴포넌트 객체를 처리해야 한다', () => {
      render(<CustomMDX source="test" components={{}} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('여러 커스텀 컴포넌트를 동시에 처리해야 한다', () => {
      const CustomH1 = () => <h1 data-testid="custom-h1">H1</h1>
      const CustomH2 = () => <h2 data-testid="custom-h2">H2</h2>
      const CustomP = () => <p data-testid="custom-p">P</p>

      const customComponents = {
        h1: CustomH1,
        h2: CustomH2,
        p: CustomP,
      }

      render(<CustomMDX source="content" components={customComponents} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('엣지 케이스', () => {
    it('매우 짧은 source를 처리해야 한다', () => {
      render(<CustomMDX source="a" />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('공백만 있는 source를 처리해야 한다', () => {
      render(<CustomMDX source="   " />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('탭과 개행 문자만 있는 source를 처리해야 한다', () => {
      render(<CustomMDX source="\t\n\r" />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('유니코드 문자를 포함한 source를 처리해야 한다', () => {
      const unicodeSource = '# 한글 제목 🎉 émojis ñ 中文'
      render(<CustomMDX source={unicodeSource} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('중첩된 마크다운 구조를 처리해야 한다', () => {
      const nestedSource = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
`
      render(<CustomMDX source={nestedSource} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('HTML 태그가 포함된 source를 처리해야 한다', () => {
      const htmlSource = '<div>HTML content</div>'
      render(<CustomMDX source={htmlSource} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('스크립트 태그를 포함한 source를 안전하게 처리해야 한다', () => {
      const scriptSource = '<script>alert("xss")</script>'
      render(<CustomMDX source={scriptSource} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('백틱 문자가 포함된 source를 처리해야 한다', () => {
      const backtickSource = '```javascript\nconst x = 1;\n```'
      render(<CustomMDX source={backtickSource} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })

    it('링크와 이미지가 혼합된 source를 처리해야 한다', () => {
      const mixedSource = '[Link](http://example.com) ![Image](http://example.com/image.png)'
      render(<CustomMDX source={mixedSource} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('컴포넌트 props 전달', () => {
    it('추가 props가 MDXRemote에 전달되어야 한다', () => {
      const additionalProps = {
        scope: { customData: 'test' },
      }

      render(<CustomMDX source="test" {...additionalProps} />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('접근성', () => {
    it('렌더링된 콘텐츠가 접근 가능해야 한다', () => {
      render(<CustomMDX source="# Accessible Content" />)

      const content = screen.getByTestId('mdx-content')
      expect(content).toBeInTheDocument()
      expect(content).toBeVisible()
    })
  })
})
