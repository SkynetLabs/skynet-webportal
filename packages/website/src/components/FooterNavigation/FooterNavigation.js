import * as React from "react";
import classnames from "classnames";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    header: "Skynet Labs",
    links: [
      { title: "About us", href: "/" },
      { title: "Brand Guidelines", href: "/" },
      { title: "Careers", href: "/" },
      { title: "Terms of Use", href: "/terms-of-use.pdf" },
      { title: "Privacy Policy", href: "/privacy-policy.pdf" },
    ],
  },
  {
    header: "Developers",
    links: [
      { title: "About us", href: "/" },
      { title: "API Documentation", href: "/" },
      { title: "SDK Documentation", href: "https://siasky.net/docs/" },
      { title: "Developer Guide", href: "/" },
      { title: "Portal Setup", href: "/" },
    ],
  },
  {
    header: "Technology",
    links: [
      { title: "What is Skynet?", href: "/" },
      { title: "Technology Guide", href: "/" },
      { title: "Pricing", href: "/pricing" },
      { title: "Skynet Wiki", href: "/" },
      { title: "Support", href: "https://support.siasky.net", target: "_blank" },
    ],
  },
  {
    header: "Ecosystem",
    links: [
      { title: "Sia Foundation", href: "/" },
      { title: "Sia Foundation Forum", href: "/" },
      { title: "Sia.tech", href: "https://sia.tech", target: "_blank" },
      { title: "SiaStats", href: "https://siastats.info", target: "_blank" },
      { title: "Skynet AppStore", href: "/" },
    ],
  },
  {
    header: "Skynet Webportals",
    links: [
      { title: "Skydrain", href: "https://skydrain.net/", target: "_blank" },
      { title: "SkyPortal", href: "https://skyportal.xyz", target: "_blank" },
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
                    <a {...rest} className="text-white font-content">
                      {title}
                    </a>
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
                        <a {...rest} className="text-white font-content">
                          {title}
                        </a>
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
