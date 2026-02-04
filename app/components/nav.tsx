import Link from 'next/link'

interface NavigationItem {
  name: string
  href: string
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'home',
    href: '/',
  },
  {
    name: 'blog',
    href: '/blog',
  },
  {
    name: 'deploy',
    href: 'https://vercel.com/templates/next.js/portfolio-starter-kit',
  },
]

const NAVIGATION_LINK_STYLES =
  'transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1'

interface NavigationLinkProps {
  href: string
  name: string
}

const NavigationLink = ({ href, name }: NavigationLinkProps) => (
  <Link href={href} className={NAVIGATION_LINK_STYLES}>
    {name}
  </Link>
)

export const Navbar = () => {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          id="nav"
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {NAVIGATION_ITEMS.map(({ href, name }) => (
              <NavigationLink key={href} href={href} name={name} />
            ))}
          </div>
        </nav>
      </div>
    </aside>
  )
}
