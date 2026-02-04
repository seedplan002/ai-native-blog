import { ImageResponse } from 'next/og';

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const DEFAULT_TITLE = 'Next.js Portfolio Starter';

interface OGImageTemplateProps {
  title: string;
}

const extractTitleFromRequest = (request: Request): string => {
  const { searchParams } = new URL(request.url);
  return searchParams.get('title') || DEFAULT_TITLE;
};

const OGImageTemplate = ({ title }: OGImageTemplateProps) => (
  <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
    <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
      <h2 tw="flex flex-col text-4xl font-bold tracking-tight text-left">
        {title}
      </h2>
    </div>
  </div>
);

const createImageResponseConfig = () => ({
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
});

export function GET(request: Request) {
  const title = extractTitleFromRequest(request);

  return new ImageResponse(
    <OGImageTemplate title={title} />,
    createImageResponseConfig()
  );
}
