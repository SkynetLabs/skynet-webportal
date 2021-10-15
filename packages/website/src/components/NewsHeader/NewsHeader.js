import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import Link from "../Link";
import { ArrowRight, DiscordSmall } from "../Icons";

const NewsHeader = () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query LatestNewsQuery {
      allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }, limit: 1) {
        edges {
          node {
            id
            frontmatter {
              title
              external
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  const [latestNews] = allMarkdownRemark.edges;

  if (!latestNews) return null; // no news

  const { frontmatter, fields } = latestNews.node;
  const { title, external } = frontmatter;
  const link = external ? { href: external } : { to: fields.slug };

  return (
    <div className="bg-palette-500 px-8 p-3">
      <div className="max-w-layout mx-auto">
        <div className="flex justify-between">
          <Link
            {...link}
            className="text-palette-300 font-content leading-8 flex items-center overflow-hidden text-base hover:text-primary transition-colors duration-200"
          >
            <ArrowRight className="mr-2 flex-shrink-0 fill-current text-primary" />
            <span className="truncate">{title}</span>
          </Link>

          <div className="ml-auto items-center pl-8 hidden desktop:block">
            <Link
              href="https://discord.gg/skynetlabs"
              className="text-palette-300 leading-8 font-content flex items-center flex-shrink-0 whitespace-nowrap hover:text-palette-200 transition-colors duration-200 space-x-2"
            >
              <DiscordSmall className="fill-current" />
              <span>Join our Discord</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

NewsHeader.propTypes = {};

NewsHeader.defaultProps = {};

export default NewsHeader;
