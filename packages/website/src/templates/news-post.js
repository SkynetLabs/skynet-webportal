import * as React from "react";
import { graphql } from "gatsby";
import Layout, { Section, SectionTitle } from "../components/Layout";
import { Aside } from "../components/News";
import SEO from "../components/seo";
import { TwitterShareButton, LinkedinShareButton, FacebookShareButton } from "react-share";
import { TwitterSmall, LinkedinSmall, FacebookSmall } from "../components/Icons";

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  // const { previous, next } = data;

  console.log(post);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <Section className="bg-white" first={true}>
        <article className="blog-post" itemScope itemType="http://schema.org/Article">
          <SectionTitle itemProp="headline" className="mb-16">
            {post.frontmatter.title}
          </SectionTitle>

          <div className="grid grid-cols-3 gap-8">
            <aside className="space-y-5">
              <Aside avatar={post.frontmatter.avatar} author={post.frontmatter.author} date={post.frontmatter.date} />

              <hr className="text-palette-200" />

              <div className="flex items-center">
                <div class="text-xs uppercase mr-4">Share</div>

                <TwitterShareButton url={location.href} title={post.frontmatter.title}>
                  <TwitterSmall />
                </TwitterShareButton>

                <LinkedinShareButton url={location.href} title={post.frontmatter.title}>
                  <LinkedinSmall />
                </LinkedinShareButton>
              </div>
            </aside>
            <section dangerouslySetInnerHTML={{ __html: post.html }} itemProp="articleBody" className="col-span-2" />
          </div>
        </article>
      </Section>
    </Layout>
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
