import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import classnames from "classnames";
import LogoWhiteText from "../Icons/LogoWhiteText.svg";
import LogoBlackText from "../Icons/LogoBlackText.svg";
import MenuMobile from "../Icons/MenuMobile.svg";
import MenuMobileClose from "../Icons/MenuMobileClose.svg";
import DiscordSmall from "../Icons/DiscordSmall.svg";

const routes = [
  { title: "Home", route: "/" },
  { title: "About", route: "/about" },
  { title: "Developers", route: "/developers" },
  { title: "News", route: "/news" },
];

const LogInLink = () => (
  <a href="https://secure.siasky.net" className="text-primary text-xs uppercase whitespace-nowrap">
    Log in
  </a>
);

const LogInButton = ({ className, ...props }) => (
  <a
    href="https://secure.siasky.net/auth/register"
    className={classnames(
      "border-2 border-white text-white px-7 leading-10 rounded-full text-xs uppercase text-center whitespace-nowrap",
      className
    )}
    {...props}
  >
    Log in
  </a>
);

const SignUpButton = ({ className, ...props }) => (
  <a
    href="https://secure.siasky.net/auth/register"
    className={classnames(
      "bg-primary text-palette-600 px-7 leading-10 rounded-full text-xs uppercase text-center whitespace-nowrap",
      className
    )}
    {...props}
  >
    Sign up
  </a>
);

const Navigation = ({ mode }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <nav className={classnames("relative px-8 py-12", { "bg-palette-600": open }, "desktop:bg-transparent")}>
      <div className="max-w-layout mx-auto">
        <div className="flex justify-between">
          <Link to="/" className={classnames("flex flex-shrink-0 items-center", { hidden: open }, "desktop:flex")}>
            {mode === "dark" && <LogoWhiteText className="h-8 w-auto" />}
            {mode === "light" && <LogoBlackText className="h-8 w-auto" />}
          </Link>
          <div className="ml-auto flex items-center desktop:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setOpen(!open)}
            >
              <span className="sr-only">Open main menu</span>
              <MenuMobile className={classnames({ hidden: open })} aria-hidden="true" />
              <MenuMobileClose className={classnames({ hidden: !open })} aria-hidden="true" />
            </button>
          </div>
          <div className="hidden desktop:ml-6 desktop:flex desktop:items-center desktop:space-x-12">
            {routes.map(({ title, route }) => (
              <Link
                key={route}
                to={route}
                className={classnames("text-sm font-light", {
                  "text-white": mode === "dark",
                  "text-palette-600": mode === "light",
                })}
              >
                {title}
              </Link>
            ))}
            <LogInLink />
            <SignUpButton />
          </div>
        </div>
      </div>
      <div
        className={classnames("absolute bg-palette-600 inset-x-0 px-8 pb-12 desktop:hidden", {
          block: open,
          hidden: !open,
        })}
        id="mobile-menu"
      >
        <ul className="pt-4 pb-10 space-y-2">
          {routes.map(({ title, route }) => (
            <li key={title}>
              <Link key={route} to={route} className="text-xl leading-7 font-semibold text-white">
                {title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-palette-500 py-7">
          <a
            href="https://discordapp.com/invite/sia"
            className="text-palette-300 text-m font-content flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordSmall className="mr-2 fill-current text-white" />
            <span>Join our Discord</span>
          </a>
        </div>
        <div className="pt-12 pb-8 border-t border-palette-500">
          <div className="flex items-center px-4 space-x-6">
            <LogInButton className="flex-grow" />
            <SignUpButton className="flex-grow" />
          </div>
        </div>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  mode: PropTypes.oneOf(["dark", "light"]),
};

Navigation.defaultProps = {
  mode: "dark",
};

export default Navigation;
