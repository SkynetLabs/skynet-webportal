import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Section, Label } from "../components/Layout";
import { NewsSummary } from "../components/News";
import Link from "../components/Link";
import Seo from "../components/seo";

const NewsCard = ({ frontmatter, fields }) => {
  const { title, external, categories, description, thumbnail, avatar, author, date } = frontmatter;
  const link = external ? { href: external } : { to: fields.slug };

  return (
    <div className="flex flex-col">
      <Link {...link} className="flex items-center">
        <GatsbyImage image={getImage(thumbnail)} alt={title} />
      </Link>

      {categories && (
        <div className="mt-6">
          {categories.map((category) => (
            <Label key={category}>{category}</Label>
          ))}
        </div>
      )}

      <Link {...link} className="mt-6 text-xl">
        {title}
      </Link>

      {description && (
        <Link {...link} className="mt-4 font-content text-palette-400">
          {description}
        </Link>
      )}

      <div className="mt-6">
        <NewsSummary avatar={avatar} author={author} date={date} />
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
          className="absolute top-0 left-0 right-0 hidden bg-white desktop:block bg-column"
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
                gatsbyImageData(
                  width: 320
                  height: 170
                  placeholder: BLURRED
                  formats: [AUTO, AVIF, WEBP]
                  transformOptions: { fit: COVER, cropFocus: CENTER }
                )
              }
            }
            avatar {
              childImageSharp {
                gatsbyImageData(
                  width: 40
                  placeholder: BLURRED
                  formats: [AUTO, AVIF, WEBP]
                  transformOptions: { fit: COVER, cropFocus: CENTER }
                )
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
