import Image from 'next/image'
import { Author } from 'app/blog/authors'

interface AuthorProfileProps {
  author: Author
}

interface AuthorAvatarProps {
  name: string
  avatarUrl: string
}

interface AuthorDetailsProps {
  name: string
  bio: string
}

const AVATAR_SIZE = 56

const STYLE_CLASSES = {
  container: 'mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800',
  contentWrapper: 'flex items-center gap-4',
  avatar: 'rounded-full',
  authorName: 'font-medium text-neutral-900 dark:text-neutral-100',
  authorBio: 'text-sm text-neutral-600 dark:text-neutral-400',
} as const

const AuthorAvatar = ({ name, avatarUrl }: AuthorAvatarProps) => {
  const normalizedAvatarUrl = avatarUrl || '/authors/placeholder.svg'
  const isExternalAvatar =
    normalizedAvatarUrl.startsWith('http://') || normalizedAvatarUrl.startsWith('https://')

  if (isExternalAvatar) {
    // 외부 도메인 이미지는 next/image 도메인 설정 없이도 안전하게 로딩되도록 기본 img 태그 사용
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={normalizedAvatarUrl}
        alt={name}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        className={STYLE_CLASSES.avatar}
      />
    )
  }

  return (
    <Image
      src={normalizedAvatarUrl}
      alt={name}
      width={AVATAR_SIZE}
      height={AVATAR_SIZE}
      className={STYLE_CLASSES.avatar}
    />
  )
}

const AuthorDetails = ({ name, bio }: AuthorDetailsProps) => {
  return (
    <div>
      <p className={STYLE_CLASSES.authorName}>{name}</p>
      <p className={STYLE_CLASSES.authorBio}>{bio}</p>
    </div>
  )
}

export const AuthorProfile = ({ author }: AuthorProfileProps) => {
  return (
    <div className={STYLE_CLASSES.container}>
      <div className={STYLE_CLASSES.contentWrapper}>
        <AuthorAvatar name={author.name} avatarUrl={author.avatar} />
        <AuthorDetails name={author.name} bio={author.bio} />
      </div>
    </div>
  )
}
