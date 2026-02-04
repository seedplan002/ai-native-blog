export type Author = {
  id: string
  name: string
  bio: string
  avatar: string
}

const authors: Author[] = [
  {
    id: 'default',
    name: 'Dingco',
    bio: '개발과 기술에 대해 글을 쓰는 블로거입니다.',
    avatar: '/authors/placeholder.svg',
  },
]

export function getAuthorById(id: string): Author | undefined {
  return authors.find((author) => author.id === id)
}

export function getDefaultAuthor(): Author {
  return authors[0]
}
