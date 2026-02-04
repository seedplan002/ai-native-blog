import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './footer';

describe('Footer Component', () => {
  describe('렌더링', () => {
    it('footer 요소가 렌더링되어야 한다', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('모든 링크가 렌더링되어야 한다', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
    });

    it('저작권 텍스트가 렌더링되어야 한다', () => {
      const currentYear = new Date().getFullYear();
      render(<Footer />);
      const copyrightText = screen.getByText(`© ${currentYear} MIT Licensed`);
      expect(copyrightText).toBeInTheDocument();
    });
  });

  describe('RSS 링크', () => {
    it('올바른 href 속성을 가져야 한다', () => {
      render(<Footer />);
      const rssLink = screen.getByRole('link', { name: /rss/i });
      expect(rssLink).toHaveAttribute('href', '/rss');
    });

    it('새 탭에서 열리도록 설정되어야 한다', () => {
      render(<Footer />);
      const rssLink = screen.getByRole('link', { name: /rss/i });
      expect(rssLink).toHaveAttribute('target', '_blank');
    });

    it('보안 속성이 설정되어야 한다', () => {
      render(<Footer />);
      const rssLink = screen.getByRole('link', { name: /rss/i });
      expect(rssLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('ArrowIcon이 포함되어야 한다', () => {
      render(<Footer />);
      const rssLink = screen.getByRole('link', { name: /rss/i });
      const svg = rssLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('텍스트가 표시되어야 한다', () => {
      render(<Footer />);
      const rssText = screen.getByText('rss');
      expect(rssText).toBeInTheDocument();
    });
  });

  describe('GitHub 링크', () => {
    it('올바른 href 속성을 가져야 한다', () => {
      render(<Footer />);
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/vercel/next.js');
    });

    it('새 탭에서 열리도록 설정되어야 한다', () => {
      render(<Footer />);
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('target', '_blank');
    });

    it('보안 속성이 설정되어야 한다', () => {
      render(<Footer />);
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('ArrowIcon이 포함되어야 한다', () => {
      render(<Footer />);
      const githubLink = screen.getByRole('link', { name: /github/i });
      const svg = githubLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('텍스트가 표시되어야 한다', () => {
      render(<Footer />);
      const githubText = screen.getByText('github');
      expect(githubText).toBeInTheDocument();
    });
  });

  describe('View Source 링크', () => {
    it('올바른 href 속성을 가져야 한다', () => {
      render(<Footer />);
      const viewSourceLink = screen.getByRole('link', { name: /view source/i });
      expect(viewSourceLink).toHaveAttribute('href', 'https://vercel.com/templates/next.js/portfolio-starter-kit');
    });

    it('새 탭에서 열리도록 설정되어야 한다', () => {
      render(<Footer />);
      const viewSourceLink = screen.getByRole('link', { name: /view source/i });
      expect(viewSourceLink).toHaveAttribute('target', '_blank');
    });

    it('보안 속성이 설정되어야 한다', () => {
      render(<Footer />);
      const viewSourceLink = screen.getByRole('link', { name: /view source/i });
      expect(viewSourceLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('ArrowIcon이 포함되어야 한다', () => {
      render(<Footer />);
      const viewSourceLink = screen.getByRole('link', { name: /view source/i });
      const svg = viewSourceLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('텍스트가 표시되어야 한다', () => {
      render(<Footer />);
      const viewSourceText = screen.getByText('view source');
      expect(viewSourceText).toBeInTheDocument();
    });
  });

  describe('스타일링 및 클래스', () => {
    it('footer에 올바른 마진 클래스가 적용되어야 한다', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('mb-16');
    });

    it('링크들이 호버 효과 클래스를 가져야 한다', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass('hover:text-neutral-800');
        expect(link).toHaveClass('dark:hover:text-neutral-100');
      });
    });

    it('링크들이 transition 클래스를 가져야 한다', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass('transition-all');
      });
    });
  });

  describe('ArrowIcon 컴포넌트', () => {
    it('모든 링크에 ArrowIcon이 렌더링되어야 한다', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        const svg = link.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });

    it('ArrowIcon이 올바른 viewBox를 가져야 한다', () => {
      render(<Footer />);
      const rssLink = screen.getByRole('link', { name: /rss/i });
      const svg = rssLink.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 12 12');
    });

    it('ArrowIcon이 올바른 크기를 가져야 한다', () => {
      render(<Footer />);
      const rssLink = screen.getByRole('link', { name: /rss/i });
      const svg = rssLink.querySelector('svg');
      expect(svg).toHaveAttribute('width', '12');
      expect(svg).toHaveAttribute('height', '12');
    });

    it('ArrowIcon에 path 요소가 있어야 한다', () => {
      render(<Footer />);
      const rssLink = screen.getByRole('link', { name: /rss/i });
      const path = rssLink.querySelector('svg path');
      expect(path).toBeInTheDocument();
    });

    it('ArrowIcon path가 currentColor를 fill로 사용해야 한다', () => {
      render(<Footer />);
      const rssLink = screen.getByRole('link', { name: /rss/i });
      const path = rssLink.querySelector('svg path');
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  describe('접근성', () => {
    it('footer 요소가 contentinfo 역할을 가져야 한다', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('모든 링크가 link 역할을 가져야 한다', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('모든 링크에 접근 가능한 텍스트가 있어야 한다', () => {
      render(<Footer />);
      const rssLink = screen.getByRole('link', { name: /rss/i });
      const githubLink = screen.getByRole('link', { name: /github/i });
      const viewSourceLink = screen.getByRole('link', { name: /view source/i });

      expect(rssLink).toBeInTheDocument();
      expect(githubLink).toBeInTheDocument();
      expect(viewSourceLink).toBeInTheDocument();
    });
  });

  describe('레이아웃', () => {
    it('링크 목록이 ul 요소로 렌더링되어야 한다', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      const list = footer.querySelector('ul');
      expect(list).toBeInTheDocument();
    });

    it('각 링크가 li 요소 내에 있어야 한다', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      const listItems = footer.querySelectorAll('li');
      expect(listItems).toHaveLength(3);
    });

    it('링크 목록이 반응형 flex 클래스를 가져야 한다', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      const list = footer.querySelector('ul');
      expect(list).toHaveClass('flex');
      expect(list).toHaveClass('flex-col');
      expect(list).toHaveClass('md:flex-row');
    });
  });

  describe('엣지 케이스', () => {
    it('현재 연도가 동적으로 계산되어야 한다', () => {
      const currentYear = new Date().getFullYear();
      render(<Footer />);
      const copyrightText = screen.getByText(`© ${currentYear} MIT Licensed`);
      expect(copyrightText).toBeInTheDocument();
    });

    it('footer가 비어있지 않아야 한다', () => {
      const { container } = render(<Footer />);
      expect(container.firstChild).not.toBeEmptyDOMElement();
    });

    it('중복된 링크가 없어야 한다', () => {
      render(<Footer />);
      const rssLinks = screen.getAllByRole('link', { name: /rss/i });
      const githubLinks = screen.getAllByRole('link', { name: /github/i });
      const viewSourceLinks = screen.getAllByRole('link', { name: /view source/i });

      expect(rssLinks).toHaveLength(1);
      expect(githubLinks).toHaveLength(1);
      expect(viewSourceLinks).toHaveLength(1);
    });
  });

  describe('다크 모드 클래스', () => {
    it('링크에 다크 모드 텍스트 색상 클래스가 있어야 한다', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass('dark:hover:text-neutral-100');
      });
    });

    it('저작권 텍스트에 다크 모드 색상 클래스가 있어야 한다', () => {
      const currentYear = new Date().getFullYear();
      render(<Footer />);
      const copyrightText = screen.getByText(`© ${currentYear} MIT Licensed`);
      expect(copyrightText).toHaveClass('dark:text-neutral-300');
    });

    it('링크 목록에 다크 모드 색상 클래스가 있어야 한다', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      const list = footer.querySelector('ul');
      expect(list).toHaveClass('dark:text-neutral-300');
    });
  });

  describe('스냅샷', () => {
    it('Footer가 일관된 구조를 유지해야 한다', () => {
      const { container } = render(<Footer />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
