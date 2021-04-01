import * as React from "react";
import { graphql } from "gatsby";
import Layout, { Section } from "../components/Layout";
import { NewsSummary } from "../components/News";
import Link from "../components/Link";
import SEO from "../components/seo";

const NewsCard = ({ ...props }) => {
  return (
    <div className="flex flex-col">
      <Link to={props.fields.slug}>
        <img src={`https://picsum.photos/320/170?${Math.random()}`} alt={props.frontmatter.title} />
      </Link>

      <Link to={props.fields.slug} className="text-xl mt-6">
        {props.frontmatter.title}
      </Link>

      {props.frontmatter.description && (
        <Link to={props.fields.slug} className="font-content text-palette-400 mt-4">
          {props.frontmatter.description}
        </Link>
      )}

      <div className="mt-6">
        <NewsSummary
          avatar={props.frontmatter.avatar}
          author={props.frontmatter.author}
          date={props.frontmatter.date}
        />
      </div>
    </div>
  );
};

const NewsPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="News" />

      <Section className="bg-white" first={true}>
        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-x-8 gap-y-24">
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <NewsCard key={node.id} {...node} />
          ))}
        </div>
      </Section>
    </Layout>
  );
};

export const query = graphql`
  query NewsQuery {
    allMarkdownRemark(
      filter: { frontmatter: { hidden: { ne: true } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          id
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
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default NewsPage;
