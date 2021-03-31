import * as React from "react";
import classnames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import Link from "../Link";

const sections = [
  {
    header: "Skynet Labs",
    links: [
      { title: "About us", to: "/about" },
      {
        title: "Brand Guidelines",
        href: "https://support.siasky.net/key-concepts/skynet-brand-guidelines",
      },
      { title: "Careers", href: "https://jobs.lever.co/nebulous" },
      { title: "Terms of Use", href: "/terms.pdf" },
      { title: "Privacy Policy", href: "/privacy.pdf" },
    ],
  },
  {
    header: "Developers",
    links: [
      { title: "Developer Guide", href: "https://support.siasky.net/the-technology/developing-on-skynet" },
      { title: "API & SDK Documentation", href: "https://siasky.net/docs/" },
      { title: "Portal Setup", href: "https://support.siasky.net/the-technology/running-a-web-portal" },
    ],
  },
  {
    header: "Technology",
    links: [
      { title: "What is Skynet?", href: "https://support.siasky.net" },
      { title: "Frequent Questions", href: "https://support.siasky.net/key-concepts/faqs" },
      // { title: "Pricing", to: "/pricing" },
      { title: "Skynet Wiki", href: "https://skynetwiki.tech" },
      { title: "Support", href: "https://support.siasky.net" },
    ],
  },
  {
    header: "Ecosystem",
    links: [
      { title: "Sia Foundation", href: "https://sia.tech" },
      { title: "Sia Foundation Forum", href: "https://forum.sia.tech" },
      { title: "SiaStats", href: "https://siastats.info" },
      { title: "Skynet AppStore", href: "https://skyapps.hns.siasky.net/" },
    ],
  },
  {
    header: "Skynet Webportals",
    links: [
      { title: "Skydrain", href: "https://skydrain.net" },
      { title: "SkyPortal", href: "https://skyportal.xyz" },
    ],
  },
];

const FooterNavigation = () => {
  const [activeSection, setActiveSection] = React.useState(sections[0]);

  return (
    <div className="bg-palette-500 px-8 py-14">
      <div className="max-w-content mx-auto grid grid-cols-1 desktop:grid-cols-5 desktop:gap-x-6 gap-y-4 desktop:gap-y-0">
        {sections.map((section) => (
          <div key={section.header}>
            {/* desktop */}
            <div className="hidden desktop:block">
              <div className="text-lg text-palette-300 font-light">{section.header}</div>
              <ul>
                {section.links.map(({ title, ...rest }) => (
                  <li key={title} className="mt-2 first:mt-4">
                    <Link
                      {...rest}
                      className="text-white font-content hover:text-primary transition-colors duration-200"
                    >
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
                className={classnames("text-lg font-light hover:text-primary transition-colors duration-200", {
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
                        <Link
                          {...rest}
                          className="text-white font-content hover:text-primary transition-colors duration-200"
                        >
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
