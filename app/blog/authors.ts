export type Author = {
  name: string
  bio: string
  avatar: string
}

const DEFAULT_AUTHOR: Author = {
  name: 'Author',
  bio: '개발과 기술에 대해 글을 쓰는 블로거입니다.',
  avatar: '/authors/placeholder.svg',
}

export function getAuthor(name?: string): Author {
  if (!name) {
    return DEFAULT_AUTHOR
  }

  return {
    ...DEFAULT_AUTHOR,
    name,
  }
}
