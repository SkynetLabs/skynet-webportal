import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Section, Label } from "../components/Layout";
import { NewsSummary } from "../components/News";
import Link from "../components/Link";
import Seo from "../components/seo";

const NewsCard = ({ ...props }) => {
  const linkProps = { to: !props.frontmatter.external && props.fields.slug, href: props.frontmatter.external };

  return (
    <div className="flex flex-col">
      <Link {...linkProps} className="flex items-center">
        <GatsbyImage image={getImage(props.frontmatter.thumbnail)} alt={props.frontmatter.title} />
      </Link>

      {props.frontmatter.categories && (
        <div className="mt-6">
          {props.frontmatter.categories.map((category) => (
            <Label key={category}>{category}</Label>
          ))}
        </div>
      )}

      <Link {...linkProps} className="text-xl mt-6">
        {props.frontmatter.title}
      </Link>

      {props.frontmatter.description && (
        <Link {...linkProps} className="font-content text-palette-400 mt-4">
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
    <>
      <Seo title="News" />

      <Section className="bg-white" first={true}>
        {/* this is the gray box in the top left corner, 400px height is totally arbitrary but it works */}
        <div
          className="hidden desktop:block bg-white bg-column absolute top-0 left-0 right-0"
          style={{ height: "400px" }}
        />

        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-x-8 gap-y-24">
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <NewsCard key={node.id} {...node} />
          ))}
        </div>
      </Section>
    </>
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
            categories
            external
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 320, height: 170, placeholder: BLURRED, transformOptions: { cropFocus: CENTER })
              }
            }
            avatar {
              childImageSharp {
                gatsbyImageData(width: 40, placeholder: BLURRED, transformOptions: { cropFocus: CENTER })
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
