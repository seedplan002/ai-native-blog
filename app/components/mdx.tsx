import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'

interface TableData {
  headers: string[]
  rows: string[][]
}

interface TableProps {
  data: TableData
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}

interface ImageProps extends React.ComponentProps<typeof Image> {
  alt: string
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children: string
}

interface HeadingProps {
  children: string
}

interface CustomMDXProps {
  source: string
  components?: Record<string, React.ComponentType<any>>
}

const isInternalLink = (href: string): boolean => href.startsWith('/')

const isAnchorLink = (href: string): boolean => href.startsWith('#')

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

const TableHeader: React.FC<{ headers: string[] }> = ({ headers }) => (
  <thead>
    <tr>
      {headers.map((header, index) => (
        <th key={index}>{header}</th>
      ))}
    </tr>
  </thead>
)

const TableBody: React.FC<{ rows: string[][] }> = ({ rows }) => (
  <tbody>
    {rows.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((cell, cellIndex) => (
          <td key={cellIndex}>{cell}</td>
        ))}
      </tr>
    ))}
  </tbody>
)

const Table: React.FC<TableProps> = ({ data }) => (
  <table>
    <TableHeader headers={data.headers} />
    <TableBody rows={data.rows} />
  </table>
)

const CustomLink: React.FC<LinkProps> = ({ href, children, ...props }) => {
  if (isInternalLink(href)) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  if (isAnchorLink(href)) {
    return <a href={href} {...props}>{children}</a>
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

const RoundedImage: React.FC<ImageProps> = ({ alt, ...props }) => (
  <Image alt={alt} className="rounded-lg" {...props} />
)

const Code: React.FC<CodeProps> = ({ children, ...props }) => {
  const highlightedCode = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: highlightedCode }} {...props} />
}

const createHeadingAnchorLink = (slug: string): React.ReactElement => {
  return React.createElement('a', {
    href: `#${slug}`,
    key: `link-${slug}`,
    className: 'anchor',
  })
}

const createHeading = (level: number): React.FC<HeadingProps> => {
  const Heading: React.FC<HeadingProps> = ({ children }) => {
    const slug = slugify(children)
    const headingTag = `h${level}`
    const anchorLink = createHeadingAnchorLink(slug)

    return React.createElement(
      headingTag,
      { id: slug },
      [anchorLink],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

const MDX_COMPONENTS = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
}

export const CustomMDX: React.FC<CustomMDXProps> = ({ components: customComponents, ...props }) => {
  const mergedComponents = { ...MDX_COMPONENTS, ...(customComponents || {}) }

  return (
    <MDXRemote
      {...props}
      components={mergedComponents}
    />
  )
}
