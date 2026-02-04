import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { ViewCount } from 'app/components/view-count'

interface BlogPost {
  slug: string
  metadata: {
    title: string
    publishedAt: string
  }
}

interface BlogPostItemProps {
  slug: string
  title: string
  publishedAt: string
}

const compareBlogPostsByDate = (firstPost: BlogPost, secondPost: BlogPost): number => {
  const firstPostDate = new Date(firstPost.metadata.publishedAt).getTime()
  const secondPostDate = new Date(secondPost.metadata.publishedAt).getTime()
  return secondPostDate - firstPostDate
}

const sortBlogPostsByDateDescending = (posts: BlogPost[]): BlogPost[] => {
  return [...posts].sort(compareBlogPostsByDate)
}

const BlogPostItem = ({ slug, title, publishedAt }: BlogPostItemProps) => {
  const formattedDate = formatDate(publishedAt, false)
  const blogPostUrl = `/blog/${slug}`

  return (
    <Link
      className="flex flex-col space-y-1 mb-4"
      href={blogPostUrl}
    >
      <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
        <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
          {formattedDate}
        </p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-1">
          <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
            {title}
          </p>
          <ViewCount slug={slug} />
        </div>
      </div>
    </Link>
  )
}

export const BlogPosts = () => {
  const allBlogPosts = getBlogPosts()
  const sortedBlogPosts = sortBlogPostsByDateDescending(allBlogPosts)

  return (
    <div>
      {sortedBlogPosts.map((post) => (
        <BlogPostItem
          key={post.slug}
          slug={post.slug}
          title={post.metadata.title}
          publishedAt={post.metadata.publishedAt}
        />
      ))}
    </div>
  )
}
