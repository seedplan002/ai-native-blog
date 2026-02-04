import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { getAuthor } from 'app/blog/authors'
import { AuthorProfile } from 'app/components/author-profile'
import { baseUrl } from 'app/sitemap'
import { LikeButton } from 'app/components/like-button'
import { ViewCount } from 'app/components/view-count'

interface PageParams {
  params: Promise<{ slug: string }>
}

interface BlogPostMetadata {
  title: string
  publishedAt: string
  summary: string
  image?: string
  author: string
}

interface BlogPost {
  slug: string
  content: string
  metadata: BlogPostMetadata
}

interface Author {
  name: string
}

interface OpenGraphMetadata {
  title: string
  description: string
  type: 'article'
  publishedTime: string
  url: string
  images: Array<{ url: string }>
}

interface TwitterMetadata {
  card: 'summary_large_image'
  title: string
  description: string
  images: string[]
}

interface StructuredDataAuthor {
  '@type': 'Person'
  name: string
}

interface StructuredData {
  '@context': string
  '@type': string
  headline: string
  datePublished: string
  dateModified: string
  description: string
  image: string
  url: string
  author: StructuredDataAuthor
}

export async function generateStaticParams() {
  const allBlogPosts = getBlogPosts()

  return allBlogPosts.map((post) => ({
    slug: post.slug,
  }))
}

const findPostBySlug = (slug: string): BlogPost | undefined => {
  const allBlogPosts = getBlogPosts()
  return allBlogPosts.find((post) => post.slug === slug)
}

const buildOgImageUrl = (title: string, customImage?: string): string => {
  if (customImage) {
    return customImage
  }
  const encodedTitle = encodeURIComponent(title)
  return `${baseUrl}/og?title=${encodedTitle}`
}

const buildAbsoluteImageUrl = (post: BlogPost): string => {
  if (post.metadata.image) {
    return `${baseUrl}${post.metadata.image}`
  }
  const encodedTitle = encodeURIComponent(post.metadata.title)
  return `/og?title=${encodedTitle}`
}

const createOpenGraphMetadata = (
  post: BlogPost,
  ogImageUrl: string
): OpenGraphMetadata => ({
  title: post.metadata.title,
  description: post.metadata.summary,
  type: 'article',
  publishedTime: post.metadata.publishedAt,
  url: `${baseUrl}/blog/${post.slug}`,
  images: [{ url: ogImageUrl }],
})

const createTwitterMetadata = (
  post: BlogPost,
  ogImageUrl: string
): TwitterMetadata => ({
  card: 'summary_large_image',
  title: post.metadata.title,
  description: post.metadata.summary,
  images: [ogImageUrl],
})

const createStructuredData = (post: BlogPost, author: Author): StructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.metadata.title,
  datePublished: post.metadata.publishedAt,
  dateModified: post.metadata.publishedAt,
  description: post.metadata.summary,
  image: buildAbsoluteImageUrl(post),
  url: `${baseUrl}/blog/${post.slug}`,
  author: {
    '@type': 'Person',
    name: author.name,
  },
})

export async function generateMetadata({ params }: PageParams) {
  const { slug } = await params
  const post = findPostBySlug(slug)

  if (!post) {
    return
  }

  const ogImageUrl = buildOgImageUrl(post.metadata.title, post.metadata.image)

  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    openGraph: createOpenGraphMetadata(post, ogImageUrl),
    twitter: createTwitterMetadata(post, ogImageUrl),
  }
}

const StructuredDataScript = ({ post, author }: { post: BlogPost; author: Author }) => (
  <script
    type="application/ld+json"
    suppressHydrationWarning
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(createStructuredData(post, author)),
    }}
  />
)

const BlogPostHeader = ({
  title,
  publishedAt,
  slug,
}: {
  title: string
  publishedAt: string
  slug: string
}) => (
  <>
    <h1 className="title font-semibold text-2xl tracking-tighter">
      {title}
    </h1>
    <div className="flex justify-between items-center mt-2 mb-8 text-sm">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {formatDate(publishedAt)}
      </p>
      <ViewCount slug={slug} />
    </div>
  </>
)

const BlogPostContent = ({ content }: { content: string }) => (
  <article className="prose">
    <CustomMDX source={content} />
  </article>
)

export default async function Blog({ params }: PageParams) {
  const { slug } = await params
  const post = findPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const postAuthor = getAuthor(post.metadata.author)

  return (
    <section>
      <StructuredDataScript post={post} author={postAuthor} />
      <BlogPostHeader
        title={post.metadata.title}
        publishedAt={post.metadata.publishedAt}
        slug={post.slug}
      />
      <BlogPostContent content={post.content} />
      <div className="mt-6">
        <LikeButton slug={post.slug} />
      </div>
      <AuthorProfile author={postAuthor} />
    </section>
  )
}
