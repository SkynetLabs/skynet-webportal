import * as React from "react";
import { graphql } from "gatsby";
import { Section, SectionTitle, Label } from "../components/Layout";
import { NewsSummary } from "../components/News";
import Seo from "../components/seo";
import Link from "../components/Link";
import { TwitterShareButton, LinkedinShareButton, FacebookShareButton } from "react-share";
import { TwitterSmall, LinkedinSmall, FacebookSmall, ArrowUpCircle } from "../components/Icons";

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark;
  // const siteTitle = data.site.siteMetadata?.title || `Title`;
  // const { previous, next } = data;

  // console.log(post);

  return (
    <>
      <Seo title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <Section className="bg-white desktop:bg-column" first={true}>
        <Link
          to="/news"
          className="flex items-center space-x-2 relative -top-6 desktop:-top-10 hover:text-primary transition-colors duration-200"
        >
          <ArrowUpCircle className="transform -rotate-90 fill-current" />
          <span className="relative text-lg font-semibold" style={{ top: 1 }}>
            Go back
          </span>
        </Link>

        <article className="blog-post" itemScope itemType="http://schema.org/Article">
          {post.frontmatter.categories && (
            <div className="mb-4">
              {post.frontmatter.categories.map((category) => (
                <Label key={category}>{category}</Label>
              ))}
            </div>
          )}

          <SectionTitle itemProp="headline" className="mb-16">
            {post.frontmatter.title}
          </SectionTitle>

          <div className="grid grid-cols-1 desktop:grid-cols-3 gap-y-8 desktop:gap-x-8">
            <aside className="space-y-5">
              <NewsSummary
                avatar={post.frontmatter.avatar}
                author={post.frontmatter.author}
                date={post.frontmatter.date}
              />

              <hr className="text-palette-200" />

              <div className="flex items-center">
                <div className="text-xs uppercase mr-4">Share</div>

                <TwitterShareButton url={location.href} title={post.frontmatter.title} hashtags={[]}>
                  <TwitterSmall className="fill-current hover:text-palette-400 transition-colors duration-200" />
                </TwitterShareButton>

                <LinkedinShareButton
                  url={location.href}
                  title={post.frontmatter.title}
                  summary={post.frontmatter.description}
                >
                  <LinkedinSmall className="fill-current hover:text-palette-400 transition-colors duration-200" />
                </LinkedinShareButton>

                <FacebookShareButton url={location.href} quote={post.frontmatter.title}>
                  <FacebookSmall className="fill-current hover:text-palette-400 transition-colors duration-200" />
                </FacebookShareButton>
              </div>
            </aside>

            <div className="col-span-2 space-y-12">
              {post.frontmatter.description && <h2 className="text-lg font-light">{post.frontmatter.description}</h2>}
              <section dangerouslySetInnerHTML={{ __html: post.html }} itemProp="articleBody" />
            </div>
          </div>
        </article>

        <Link
          to="/news"
          className="flex items-center space-x-2 relative hover:text-primary transition-colors duration-200 mt-12 desktop:mt-0 desktop:-bottom-12"
        >
          <ArrowUpCircle className="transform -rotate-90 fill-current" />
          <span className="relative text-lg font-semibold" style={{ top: 1 }}>
            Go back
          </span>
        </Link>
      </Section>
    </>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!, $previousPostId: String, $nextPostId: String) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        categories
        author
        avatar {
          childImageSharp {
            gatsbyImageData(width: 40, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
