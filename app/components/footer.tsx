const ArrowIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
      fill="currentColor"
    />
  </svg>
);

interface FooterLinkProps {
  href: string;
  label: string;
}

const LINK_BASE_CLASSES =
  'flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100';

const FooterLink = ({ href, label }: FooterLinkProps) => (
  <li>
    <a
      className={LINK_BASE_CLASSES}
      rel="noopener noreferrer"
      target="_blank"
      href={href}
    >
      <ArrowIcon />
      <p className="ml-2 h-7">{label}</p>
    </a>
  </li>
);

const FOOTER_LINKS: FooterLinkProps[] = [
  { href: '/rss', label: 'rss' },
  { href: 'https://github.com/vercel/next.js', label: 'github' },
  {
    href: 'https://vercel.com/templates/next.js/portfolio-starter-kit',
    label: 'view source',
  },
];

const getCurrentYear = (): number => new Date().getFullYear();

const Footer = () => {
  const currentYear = getCurrentYear();

  return (
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        {FOOTER_LINKS.map(({ href, label }) => (
          <FooterLink key={href} href={href} label={label} />
        ))}
      </ul>
      <p className="mt-8 text-neutral-600 dark:text-neutral-300">
        © {currentYear} MIT Licensed
      </p>
    </footer>
  );
};

export default Footer;
