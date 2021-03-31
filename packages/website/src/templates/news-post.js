import * as React from "react";
import { Link, graphql } from "gatsby";
import Bio from "../components/bio";
import Layout, { Section, SectionTitle } from "../components/Layout";
import SEO from "../components/seo";

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  // const { previous, next } = data;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <Section className="bg-white" first={true}>
        <article className="blog-post" itemScope itemType="http://schema.org/Article">
          <SectionTitle itemProp="headline" className="mb-16">
            {post.frontmatter.title}
          </SectionTitle>

          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
            className="max-w-tablet ml-auto"
          />
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
