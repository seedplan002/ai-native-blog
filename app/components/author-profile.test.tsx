import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AuthorProfile } from './author-profile'
import { Author } from 'app/blog/authors'

// Next.js Image 컴포넌트 모킹
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string
    alt: string
    width: number
    height: number
    className: string
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}))

describe('AuthorProfile', () => {
  const mockAuthor: Author = {
    name: 'John Doe',
    bio: 'A passionate software developer',
    avatar: '/avatars/john-doe.jpg',
  }

  const renderComponent = (author: Author = mockAuthor) => {
    return render(<AuthorProfile author={author} />)
  }

  describe('렌더링', () => {
    it('작성자 프로필이 올바르게 렌더링되어야 한다', () => {
      renderComponent()

      expect(screen.getByText(mockAuthor.name)).toBeInTheDocument()
      expect(screen.getByText(mockAuthor.bio)).toBeInTheDocument()
      expect(screen.getByAltText(mockAuthor.name)).toBeInTheDocument()
    })

    it('컨테이너에 올바른 스타일 클래스가 적용되어야 한다', () => {
      const { container } = renderComponent()
      const profileContainer = container.firstChild

      expect(profileContainer).toHaveClass('mt-12')
      expect(profileContainer).toHaveClass('pt-8')
      expect(profileContainer).toHaveClass('border-t')
      expect(profileContainer).toHaveClass('border-neutral-200')
      expect(profileContainer).toHaveClass('dark:border-neutral-800')
    })
  })

  describe('아바타', () => {
    it('올바른 src로 아바타 이미지가 렌더링되어야 한다', () => {
      renderComponent()

      const avatar = screen.getByAltText(mockAuthor.name)
      expect(avatar).toHaveAttribute('src', mockAuthor.avatar)
    })

    it('아바타 이미지에 올바른 크기가 설정되어야 한다', () => {
      renderComponent()

      const avatar = screen.getByAltText(mockAuthor.name)
      expect(avatar).toHaveAttribute('width', '56')
      expect(avatar).toHaveAttribute('height', '56')
    })

    it('아바타 이미지에 rounded-full 클래스가 적용되어야 한다', () => {
      renderComponent()

      const avatar = screen.getByAltText(mockAuthor.name)
      expect(avatar).toHaveClass('rounded-full')
    })

    it('아바타 이미지에 올바른 alt 텍스트가 설정되어야 한다', () => {
      renderComponent()

      const avatar = screen.getByAltText(mockAuthor.name)
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('작성자 정보', () => {
    it('작성자 이름이 올바르게 렌더링되어야 한다', () => {
      renderComponent()

      const authorName = screen.getByText(mockAuthor.name)
      expect(authorName).toBeInTheDocument()
      expect(authorName).toHaveClass('font-medium')
      expect(authorName).toHaveClass('text-neutral-900')
      expect(authorName).toHaveClass('dark:text-neutral-100')
    })

    it('작성자 소개가 올바르게 렌더링되어야 한다', () => {
      renderComponent()

      const authorBio = screen.getByText(mockAuthor.bio)
      expect(authorBio).toBeInTheDocument()
      expect(authorBio).toHaveClass('text-sm')
      expect(authorBio).toHaveClass('text-neutral-600')
      expect(authorBio).toHaveClass('dark:text-neutral-400')
    })
  })

  describe('다양한 작성자 데이터', () => {
    it('한글 이름과 소개를 가진 작성자가 올바르게 렌더링되어야 한다', () => {
      const koreanAuthor: Author = {
        name: '홍길동',
        bio: '개발과 기술에 대해 글을 쓰는 블로거입니다.',
        avatar: '/avatars/korean-author.jpg',
      }

      renderComponent(koreanAuthor)

      expect(screen.getByText(koreanAuthor.name)).toBeInTheDocument()
      expect(screen.getByText(koreanAuthor.bio)).toBeInTheDocument()
      expect(screen.getByAltText(koreanAuthor.name)).toHaveAttribute(
        'src',
        koreanAuthor.avatar
      )
    })

    it('긴 이름을 가진 작성자가 올바르게 렌더링되어야 한다', () => {
      const longNameAuthor: Author = {
        name: 'Alexander Christopher Wellington Bartholomew III',
        bio: 'Software engineer',
        avatar: '/avatars/long-name.jpg',
      }

      renderComponent(longNameAuthor)

      expect(screen.getByText(longNameAuthor.name)).toBeInTheDocument()
    })

    it('긴 소개를 가진 작성자가 올바르게 렌더링되어야 한다', () => {
      const longBioAuthor: Author = {
        name: 'Jane Smith',
        bio: 'A passionate full-stack developer with over 10 years of experience in building scalable web applications using modern technologies like React, Node.js, and TypeScript. Loves contributing to open source and sharing knowledge through technical writing.',
        avatar: '/avatars/jane.jpg',
      }

      renderComponent(longBioAuthor)

      expect(screen.getByText(longBioAuthor.bio)).toBeInTheDocument()
    })

    it('특수 문자를 포함한 이름이 올바르게 렌더링되어야 한다', () => {
      const specialCharAuthor: Author = {
        name: "O'Connor-Smith (PhD)",
        bio: 'Research scientist',
        avatar: '/avatars/special.jpg',
      }

      renderComponent(specialCharAuthor)

      expect(screen.getByText(specialCharAuthor.name)).toBeInTheDocument()
    })

    it('특수 문자를 포함한 소개가 올바르게 렌더링되어야 한다', () => {
      const specialBioAuthor: Author = {
        name: 'Bob',
        bio: 'Developer @ Company Inc. | Open source enthusiast & technical writer',
        avatar: '/avatars/bob.jpg',
      }

      renderComponent(specialBioAuthor)

      expect(screen.getByText(specialBioAuthor.bio)).toBeInTheDocument()
    })
  })

  describe('아바타 경로 변형', () => {
    it('상대 경로 아바타가 올바르게 렌더링되어야 한다', () => {
      const relativePathAuthor: Author = {
        name: 'Alice',
        bio: 'Designer',
        avatar: '/authors/alice.png',
      }

      renderComponent(relativePathAuthor)

      const avatar = screen.getByAltText(relativePathAuthor.name)
      expect(avatar).toHaveAttribute('src', relativePathAuthor.avatar)
    })

    it('절대 URL 아바타가 올바르게 렌더링되어야 한다', () => {
      const absoluteUrlAuthor: Author = {
        name: 'Charlie',
        bio: 'Product Manager',
        avatar: 'https://example.com/avatars/charlie.jpg',
      }

      renderComponent(absoluteUrlAuthor)

      const avatar = screen.getByAltText(absoluteUrlAuthor.name)
      expect(avatar).toHaveAttribute('src', absoluteUrlAuthor.avatar)
    })

    it('SVG 아바타가 올바르게 렌더링되어야 한다', () => {
      const svgAuthor: Author = {
        name: 'Default',
        bio: 'Blogger',
        avatar: '/authors/placeholder.svg',
      }

      renderComponent(svgAuthor)

      const avatar = screen.getByAltText(svgAuthor.name)
      expect(avatar).toHaveAttribute('src', svgAuthor.avatar)
    })
  })

  describe('엣지 케이스', () => {
    it('빈 문자열 이름을 가진 작성자가 렌더링되어야 한다', () => {
      const emptyNameAuthor: Author = {
        name: '',
        bio: 'Anonymous writer',
        avatar: '/avatars/anonymous.jpg',
      }

      renderComponent(emptyNameAuthor)

      expect(screen.getByText(emptyNameAuthor.bio)).toBeInTheDocument()
      expect(screen.getByAltText('')).toBeInTheDocument()
    })

    it('빈 문자열 소개를 가진 작성자가 렌더링되어야 한다', () => {
      const emptyBioAuthor: Author = {
        name: 'Silent Author',
        bio: '',
        avatar: '/avatars/silent.jpg',
      }

      renderComponent(emptyBioAuthor)

      expect(screen.getByText(emptyBioAuthor.name)).toBeInTheDocument()
      const bioElements = screen.queryAllByText('')
      expect(bioElements.length).toBeGreaterThan(0)
    })

    it('공백만 있는 이름을 가진 작성자가 렌더링되어야 한다', () => {
      const whitespaceNameAuthor: Author = {
        name: '   ',
        bio: 'Mystery author',
        avatar: '/avatars/mystery.jpg',
      }

      renderComponent(whitespaceNameAuthor)

      expect(screen.getByText(whitespaceNameAuthor.bio)).toBeInTheDocument()
    })

    it('여러 줄 소개를 가진 작성자가 올바르게 렌더링되어야 한다', () => {
      const multilineBioAuthor: Author = {
        name: 'Writer',
        bio: 'Line 1\nLine 2\nLine 3',
        avatar: '/avatars/writer.jpg',
      }

      renderComponent(multilineBioAuthor)

      expect(screen.getByText(multilineBioAuthor.bio)).toBeInTheDocument()
    })
  })

  describe('접근성', () => {
    it('아바타 이미지에 접근 가능한 alt 텍스트가 있어야 한다', () => {
      renderComponent()

      const avatar = screen.getByAltText(mockAuthor.name)
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('alt', mockAuthor.name)
    })

    it('모든 텍스트 콘텐츠가 스크린 리더에 접근 가능해야 한다', () => {
      renderComponent()

      expect(screen.getByText(mockAuthor.name)).toBeVisible()
      expect(screen.getByText(mockAuthor.bio)).toBeVisible()
    })
  })

  describe('레이아웃', () => {
    it('컨텐츠 래퍼에 flex 레이아웃이 적용되어야 한다', () => {
      const { container } = renderComponent()
      const contentWrapper = container.querySelector('.flex.items-center.gap-4')

      expect(contentWrapper).toBeInTheDocument()
      expect(contentWrapper).toHaveClass('flex')
      expect(contentWrapper).toHaveClass('items-center')
      expect(contentWrapper).toHaveClass('gap-4')
    })

    it('작성자 정보가 올바른 순서로 렌더링되어야 한다', () => {
      const { container } = renderComponent()
      const textElements = container.querySelectorAll('p')

      expect(textElements[0]).toHaveTextContent(mockAuthor.name)
      expect(textElements[1]).toHaveTextContent(mockAuthor.bio)
    })
  })
})
