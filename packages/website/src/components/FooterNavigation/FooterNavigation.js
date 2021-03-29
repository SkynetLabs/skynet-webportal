import * as React from "react";
import classnames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import Link from "../Link";

const external = { target: "_blank", rel: "noopener noreferrer" };
const sections = [
  {
    header: "Skynet Labs",
    links: [
      { title: "About us", to: "/about" },
      {
        title: "Brand Guidelines",
        href: "https://support.siasky.net/key-concepts/skynet-brand-guidelines",
        ...external,
      },
      { title: "Careers", href: "https://jobs.lever.co/nebulous", ...external },
      { title: "Terms of Use", href: "/terms.pdf", ...external },
      { title: "Privacy Policy", href: "/privacy.pdf", ...external },
    ],
  },
  {
    header: "Developers",
    links: [
      { title: "Developer Guide", href: "https://support.siasky.net/the-technology/developing-on-skynet", ...external },
      { title: "API Documentation", href: "https://siasky.net/docs/", ...external },
      { title: "SDK Documentation", href: "https://siasky.net/docs/", ...external },
      { title: "Portal Setup", href: "https://support.siasky.net/the-technology/running-a-web-portal", ...external },
    ],
  },
  {
    header: "Technology",
    links: [
      { title: "What is Skynet?", href: "https://support.siasky.net", ...external },
      { title: "Frequent Questions", href: "https://support.siasky.net/key-concepts/faqs", ...external },
      { title: "Pricing", to: "/pricing" },
      { title: "Skynet Wiki", href: "https://skynetwiki.tech", ...external },
      { title: "Support", href: "https://support.siasky.net", ...external },
    ],
  },
  {
    header: "Ecosystem",
    links: [
      { title: "Sia Foundation", href: "https://sia.tech", ...external },
      { title: "Sia Foundation Forum", href: "https://forum.sia.tech", ...external },
      { title: "SiaStats", href: "https://siastats.info", ...external },
      { title: "Skynet AppStore", href: "https://siasky.net/hns/skyapps/", ...external },
    ],
  },
  {
    header: "Skynet Webportals",
    links: [
      { title: "Skydrain", href: "https://skydrain.net", ...external },
      { title: "SkyPortal", href: "https://skyportal.xyz", ...external },
    ],
  },
];

const FooterNavigation = () => {
  const [activeSection, setActiveSection] = React.useState(sections[0]);

  return (
    <div className="bg-palette-500 px-8 py-14">
      <div className="max-w-content mx-auto flex flex-col desktop:flex-row justify-between desktop:space-x-6 space-y-4 desktop:space-y-0">
        {sections.map((section) => (
          <div key={section.header}>
            {/* desktop */}
            <div className="hidden desktop:block">
              <div className="text-lg text-palette-300 font-light">{section.header}</div>
              <ul>
                {section.links.map(({ title, ...rest }) => (
                  <li key={title} className="mt-1 first:mt-4">
                    <Link {...rest} className="text-white font-content">
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* mobile */}
            <div className="desktop:hidden">
              <button
                type="button"
                className={classnames("text-lg font-light", {
                  "text-primary": activeSection === section,
                  "text-palette-300": activeSection !== section,
                })}
                onClick={() => setActiveSection(activeSection === section ? null : section)}
              >
                {section.header}
              </button>
              <AnimatePresence initial={false}>
                {activeSection === section && (
                  <motion.ul
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    className="overflow-hidden"
                    transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    {section.links.map(({ title, ...rest }) => (
                      <li key={title} className="mt-1 first:mt-4">
                        <Link {...rest} className="text-white font-content">
                          {title}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

FooterNavigation.propTypes = {};

FooterNavigation.defaultProps = {};

export default FooterNavigation;
