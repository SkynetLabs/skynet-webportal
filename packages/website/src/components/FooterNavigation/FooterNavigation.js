import * as React from "react";
import classnames from "classnames";

const sections = [
  {
    header: "Skynet Labs",
    links: [
      { title: "About us", href: "/" },
      { title: "Brand Guidelines", href: "/" },
      { title: "Careers", href: "/" },
      { title: "Terms of Use", href: "/" },
      { title: "Privacy Policy", href: "/" },
    ],
  },
  {
    header: "Developers",
    links: [
      { title: "About us", href: "/" },
      { title: "API Documentation", href: "/" },
      { title: "SDK Documentation", href: "/" },
      { title: "Developer Guide", href: "/" },
      { title: "Portal Setup", href: "/" },
    ],
  },
  {
    header: "Technology",
    links: [
      { title: "What is Skynet?", href: "/" },
      { title: "Technology Guide", href: "/" },
      { title: "Pricing", href: "/" },
      { title: "Skynet Wiki", href: "/" },
      { title: "Support", href: "/" },
    ],
  },
  {
    header: "Ecosystem",
    links: [
      { title: "Sia Foundation", href: "/" },
      { title: "Sia Foundation Forum", href: "/" },
      { title: "Sia.tech", href: "/" },
      { title: "SiaStats", href: "/" },
      { title: "Skynet AppStore", href: "/" },
    ],
  },
  {
    header: "Skynet Webportals",
    links: [
      { title: "Skydrain", href: "/" },
      { title: "Sialoop", href: "/" },
      { title: "Skynet.luxor", href: "/" },
      { title: "Skynet.tutemwesi", href: "/" },
      { title: "Siacdn", href: "/" },
      { title: "Valut.lightspeedhosting", href: "/" },
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
            <h3
              className={classnames("text-lg desktop:text-palette-300 cursor-pointer desktop:cursor-auto font-light", {
                "text-primary": activeSection === section,
                "text-palette-300": activeSection !== section,
              })}
              onClick={() => setActiveSection(section)}
            >
              {section.header}
            </h3>
            <ul className={classnames("mt-4 desktop:block", { hidden: activeSection !== section })}>
              {section.links.map(({ title, ...rest }) => (
                <li key={title}>
                  <a {...rest} className="text-white font-content">
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

FooterNavigation.propTypes = {};

FooterNavigation.defaultProps = {};

export default FooterNavigation;
