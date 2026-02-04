import { GET } from './route';

// Mock next/og ImageResponse
jest.mock('next/og', () => ({
  ImageResponse: jest.fn().mockImplementation((element, options) => {
    return {
      element,
      options,
      status: 200,
      headers: new Headers({
        'content-type': 'image/png',
      }),
    };
  }),
}));

describe('OG Image Route Handler', () => {
  const OG_IMAGE_WIDTH = 1200;
  const OG_IMAGE_HEIGHT = 630;
  const DEFAULT_TITLE = 'Next.js Portfolio Starter';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET 요청 처리', () => {
    it('기본 제목으로 OG 이미지를 생성해야 한다', () => {
      const request = new Request('http://localhost:3000/og');
      const { ImageResponse } = require('next/og');

      const response = GET(request);

      expect(ImageResponse).toHaveBeenCalledTimes(1);
      expect(ImageResponse).toHaveBeenCalledWith(
        expect.any(Object),
        {
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        }
      );

      // ImageResponse의 첫 번째 인자(JSX 요소)를 확인
      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(DEFAULT_TITLE);
    });

    it('title 쿼리 파라미터가 제공되면 해당 제목을 사용해야 한다', () => {
      const customTitle = 'Custom Blog Post Title';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(customTitle)}`);
      const { ImageResponse } = require('next/og');

      const response = GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(customTitle);
    });

    it('올바른 이미지 크기로 ImageResponse를 생성해야 한다', () => {
      const request = new Request('http://localhost:3000/og');
      const { ImageResponse } = require('next/og');

      GET(request);

      const [, options] = (ImageResponse as jest.Mock).mock.calls[0];
      expect(options.width).toBe(OG_IMAGE_WIDTH);
      expect(options.height).toBe(OG_IMAGE_HEIGHT);
    });
  });

  describe('엣지 케이스 처리', () => {
    it('빈 문자열 title이 제공되면 기본 제목을 사용해야 한다', () => {
      const request = new Request('http://localhost:3000/og?title=');
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(DEFAULT_TITLE);
    });

    it('매우 긴 제목을 처리할 수 있어야 한다', () => {
      const longTitle = 'A'.repeat(500);
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(longTitle)}`);
      const { ImageResponse } = require('next/og');

      const response = GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(longTitle);
      expect(response).toBeDefined();
    });

    it('특수 문자가 포함된 제목을 처리할 수 있어야 한다', () => {
      const specialTitle = 'Test & <Title> with "Quotes" and \'Apostrophes\'';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(specialTitle)}`);
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(specialTitle);
    });

    it('이모지가 포함된 제목을 처리할 수 있어야 한다', () => {
      const emojiTitle = '🚀 Next.js Blog Post 🎉';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(emojiTitle)}`);
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(emojiTitle);
    });

    it('한글 제목을 처리할 수 있어야 한다', () => {
      const koreanTitle = '한글로 작성된 블로그 포스트 제목';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(koreanTitle)}`);
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(koreanTitle);
    });

    it('URL 인코딩된 제목을 올바르게 디코딩해야 한다', () => {
      const title = 'URL Encoded Title';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(title)}`);
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(title);
    });

    it('여러 쿼리 파라미터가 있을 때 title만 사용해야 한다', () => {
      const title = 'My Title';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(title)}&foo=bar&baz=qux`);
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(title);
    });
  });

  describe('JSX 구조 검증', () => {
    it('올바른 Tailwind CSS 클래스를 가진 컨테이너를 렌더링해야 한다', () => {
      const request = new Request('http://localhost:3000/og');
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;

      // 최상위 div 검증
      expect(jsxElement.type).toBe('div');
      expect(jsxElement.props.tw).toBe('flex flex-col w-full h-full items-center justify-center bg-white');

      // 중간 레이어 div 검증
      const innerDiv = jsxElement.props.children;
      expect(innerDiv.type).toBe('div');
      expect(innerDiv.props.tw).toBe('flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8');

      // h2 태그 검증
      const h2Element = innerDiv.props.children;
      expect(h2Element.type).toBe('h2');
      expect(h2Element.props.tw).toBe('flex flex-col text-4xl font-bold tracking-tight text-left');
    });

    it('제목 텍스트가 h2 태그 내에 있어야 한다', () => {
      const title = 'Test Title';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(title)}`);
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      const h2Element = jsxElement.props.children.props.children;

      expect(h2Element.type).toBe('h2');
      expect(h2Element.props.children).toBe(title);
    });
  });

  describe('URL 파싱', () => {
    it('다양한 호스트에서 요청을 처리할 수 있어야 한다', () => {
      const hosts = [
        'http://localhost:3000',
        'https://example.com',
        'https://my-blog.vercel.app',
      ];

      hosts.forEach(host => {
        jest.clearAllMocks();
        const request = new Request(`${host}/og?title=Test`);
        const { ImageResponse } = require('next/og');

        const response = GET(request);

        expect(ImageResponse).toHaveBeenCalled();
        expect(response).toBeDefined();
      });
    });

    it('쿼리 파라미터가 없는 URL을 처리해야 한다', () => {
      const request = new Request('http://localhost:3000/og');
      const { ImageResponse } = require('next/og');

      const response = GET(request);

      expect(ImageResponse).toHaveBeenCalled();
      expect(response).toBeDefined();
    });

    it('대소문자가 다른 title 파라미터는 무시해야 한다', () => {
      const request = new Request('http://localhost:3000/og?TITLE=Wrong&Title=Wrong');
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      // title 파라미터(소문자)가 없으므로 기본값 사용
      expect(jsxElement.props.children.props.children.props.children).toBe(DEFAULT_TITLE);
    });
  });

  describe('반환값 검증', () => {
    it('ImageResponse 인스턴스를 반환해야 한다', () => {
      const request = new Request('http://localhost:3000/og');

      const response = GET(request);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('element');
      expect(response).toHaveProperty('options');
    });

    it('올바른 옵션으로 ImageResponse를 생성해야 한다', () => {
      const request = new Request('http://localhost:3000/og?title=Custom');
      const { ImageResponse } = require('next/og');

      GET(request);

      expect(ImageResponse).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 1200,
          height: 630,
        })
      );
    });
  });

  describe('상수 값 검증', () => {
    it('정의된 상수를 사용하여 이미지를 생성해야 한다', () => {
      const request = new Request('http://localhost:3000/og');
      const { ImageResponse } = require('next/og');

      GET(request);

      const [, options] = (ImageResponse as jest.Mock).mock.calls[0];
      expect(options.width).toBe(1200);
      expect(options.height).toBe(630);
    });
  });

  describe('경계값 테스트', () => {
    it('title이 null인 경우 기본값을 사용해야 한다', () => {
      // searchParams.get()이 null을 반환하는 경우
      const request = new Request('http://localhost:3000/og');
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(DEFAULT_TITLE);
    });

    it('공백만 있는 title도 허용해야 한다', () => {
      const whitespaceTitle = '   ';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(whitespaceTitle)}`);
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(whitespaceTitle);
    });

    it('줄바꿈 문자가 포함된 제목을 처리할 수 있어야 한다', () => {
      const titleWithNewline = 'Title\nWith\nNewlines';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(titleWithNewline)}`);
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(titleWithNewline);
    });

    it('숫자로만 이루어진 제목을 처리할 수 있어야 한다', () => {
      const numericTitle = '12345';
      const request = new Request(`http://localhost:3000/og?title=${encodeURIComponent(numericTitle)}`);
      const { ImageResponse } = require('next/og');

      GET(request);

      const [[jsxElement]] = (ImageResponse as jest.Mock).mock.calls;
      expect(jsxElement.props.children.props.children.props.children).toBe(numericTitle);
    });
  });
});
