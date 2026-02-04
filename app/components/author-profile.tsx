import Image from 'next/image'
import { Author } from 'app/blog/authors'

export function AuthorProfile({ author }: { author: Author }) {
  return (
    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-4">
        <Image
          src={author.avatar}
          alt={author.name}
          width={56}
          height={56}
          className="rounded-full"
        />
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {author.name}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {author.bio}
          </p>
        </div>
      </div>
    </div>
  )
}
