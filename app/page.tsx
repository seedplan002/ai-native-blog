import { BlogPosts } from 'app/components/posts'

const PORTFOLIO_TITLE = 'My Portfolio'
const INTRODUCTION_TEXT = `I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in Vim's keystroke commands and tabs' flexibility for personal viewing preferences. This extends to my support for static typing, where its early error detection ensures cleaner code, and my preference for dark mode, which eases long coding sessions by reducing eye strain.`

const PortfolioHeader = () => (
  <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
    {PORTFOLIO_TITLE}
  </h1>
)

const IntroductionText = () => (
  <p className="mb-4">
    {INTRODUCTION_TEXT}
  </p>
)

const BlogPostsSection = () => (
  <div className="my-8">
    <BlogPosts />
  </div>
)

export default function Page() {
  return (
    <section>
      <PortfolioHeader />
      <IntroductionText />
      <BlogPostsSection />
    </section>
  )
}
