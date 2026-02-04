import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFound from './not-found';

describe('NotFound', () => {
  describe('렌더링', () => {
    it('컴포넌트가 정상적으로 렌더링된다', () => {
      render(<NotFound />);

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('제목이 올바른 텍스트로 렌더링된다', () => {
      render(<NotFound />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('404 - Page Not Found');
    });

    it('메시지가 올바른 텍스트로 렌더링된다', () => {
      render(<NotFound />);

      const message = screen.getByText('The page you are looking for does not exist.');
      expect(message).toBeInTheDocument();
    });
  });

  describe('스타일링', () => {
    it('제목에 올바른 CSS 클래스가 적용된다', () => {
      render(<NotFound />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('mb-8', 'text-2xl', 'font-semibold', 'tracking-tighter');
    });

    it('메시지에 올바른 CSS 클래스가 적용된다', () => {
      render(<NotFound />);

      const message = screen.getByText('The page you are looking for does not exist.');
      expect(message).toHaveClass('mb-4');
    });
  });

  describe('구조', () => {
    it('section 요소 내부에 h1과 p 요소가 순서대로 존재한다', () => {
      const { container } = render(<NotFound />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();

      const children = section?.children;
      expect(children).toHaveLength(2);
      expect(children?.[0].tagName).toBe('H1');
      expect(children?.[1].tagName).toBe('P');
    });

    it('h1 요소가 p 요소보다 먼저 렌더링된다', () => {
      const { container } = render(<NotFound />);

      const section = container.querySelector('section');
      const heading = section?.querySelector('h1');
      const paragraph = section?.querySelector('p');

      expect(heading).toBeInTheDocument();
      expect(paragraph).toBeInTheDocument();

      // h1이 p보다 DOM 순서상 먼저 와야 함
      const headingIndex = Array.from(section?.children || []).indexOf(heading!);
      const paragraphIndex = Array.from(section?.children || []).indexOf(paragraph!);
      expect(headingIndex).toBeLessThan(paragraphIndex);
    });
  });

  describe('접근성', () => {
    it('heading이 정확한 레벨(h1)로 렌더링된다', () => {
      render(<NotFound />);

      const heading = screen.getByRole('heading', { level: 1, name: '404 - Page Not Found' });
      expect(heading).toBeInTheDocument();
    });

    it('section 요소가 landmark role을 가진다', () => {
      render(<NotFound />);

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
    });
  });

  describe('엣지 케이스', () => {
    it('여러 번 렌더링해도 동일한 결과를 반환한다', () => {
      const { unmount: unmount1 } = render(<NotFound />);
      const heading1 = screen.getByRole('heading', { level: 1 });
      const message1 = screen.getByText('The page you are looking for does not exist.');

      expect(heading1).toHaveTextContent('404 - Page Not Found');
      expect(message1).toBeInTheDocument();

      unmount1();

      const { unmount: unmount2 } = render(<NotFound />);
      const heading2 = screen.getByRole('heading', { level: 1 });
      const message2 = screen.getByText('The page you are looking for does not exist.');

      expect(heading2).toHaveTextContent('404 - Page Not Found');
      expect(message2).toBeInTheDocument();

      unmount2();
    });

    it('컴포넌트가 props를 받지 않아도 정상 작동한다', () => {
      // NotFound는 props를 받지 않는 컴포넌트
      render(<NotFound />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
    });
  });

  describe('상수 값', () => {
    it('제목 상수값이 화면에 정확히 표시된다', () => {
      render(<NotFound />);

      // TITLE 상수값 검증
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.textContent).toBe('404 - Page Not Found');
    });

    it('메시지 상수값이 화면에 정확히 표시된다', () => {
      render(<NotFound />);

      // MESSAGE 상수값 검증
      const message = screen.getByText('The page you are looking for does not exist.');
      expect(message.textContent).toBe('The page you are looking for does not exist.');
    });
  });

  describe('스냅샷 안정성', () => {
    it('DOM 구조가 안정적이다', () => {
      const { container } = render(<NotFound />);

      const section = container.querySelector('section');
      expect(section?.children).toHaveLength(2);

      const h1 = section?.querySelector('h1');
      const p = section?.querySelector('p');

      expect(h1?.textContent).toBe('404 - Page Not Found');
      expect(p?.textContent).toBe('The page you are looking for does not exist.');
    });
  });

  describe('텍스트 내용 검증', () => {
    it('제목에 숫자 404가 포함된다', () => {
      render(<NotFound />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.textContent).toContain('404');
    });

    it('제목에 "Page Not Found" 텍스트가 포함된다', () => {
      render(<NotFound />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.textContent).toContain('Page Not Found');
    });

    it('메시지에 "does not exist" 텍스트가 포함된다', () => {
      render(<NotFound />);

      const message = screen.getByText(/does not exist/i);
      expect(message).toBeInTheDocument();
    });
  });
});
