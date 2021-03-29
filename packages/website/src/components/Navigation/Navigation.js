import * as React from "react";
import PropTypes from "prop-types";
import Link from "../Link";
import classnames from "classnames";
import LogoWhiteText from "../Icons/LogoWhiteText.svg";
import LogoBlackText from "../Icons/LogoBlackText.svg";
import MenuMobile from "../Icons/MenuMobile.svg";
import MenuMobileClose from "../Icons/MenuMobileClose.svg";
import DiscordSmall from "../Icons/DiscordSmall.svg";
import { useWindowSize, useWindowScroll } from "react-use";

const routes = [
  { title: "Home", route: "/" },
  { title: "About", route: "/about" },
  { title: "Developers", route: "/developers" },
  { title: "News", route: "/news" },
];

const LogInLink = () => (
  <Link href="https://secure.siasky.net" className="text-primary text-xs uppercase whitespace-nowrap">
    Log in
  </Link>
);

const LogInButton = ({ className, ...props }) => (
  <Link
    href="https://secure.siasky.net/auth/registration"
    className={classnames(
      "border-2 border-white text-white px-7 leading-10 rounded-full text-xs uppercase text-center whitespace-nowrap",
      className
    )}
    {...props}
  >
    Log in
  </Link>
);

const SignUpButton = ({ className, ...props }) => (
  <Link
    href="https://secure.siasky.net/auth/registration"
    className={classnames(
      "bg-primary text-palette-600 px-7 leading-10 rounded-full text-xs uppercase text-center whitespace-nowrap",
      className
    )}
    {...props}
  >
    Sign up
  </Link>
);

const Navigation = ({ mode }) => {
  const navRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const windowSize = useWindowSize();
  const { y: offsetY } = useWindowScroll();

  React.useEffect(() => {
    setOpen(false);
  }, [windowSize, setOpen]);

  React.useEffect(() => {
    if (open && document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  const mobileMenuOffset = navRef.current ? navRef.current.offsetTop : 0;

  return (
    <nav
      className={classnames("relative px-8 transition-all duration-500", {
        "bg-white border-b border-palette-200": mode === "light",
        "bg-palette-600 bg-opacity-50": mode === "dark",
        "p-12": offsetY === 0,
        "p-6": offsetY > 0,
      })}
      ref={navRef}
    >
      <div className={classnames("max-w-layout mx-auto")}>
        <div className="flex justify-between">
          <Link to="/" className={classnames("flex flex-shrink-0 items-center")}>
            {mode === "dark" && <LogoWhiteText className="h-8 w-auto" />}
            {mode === "light" && <LogoBlackText className="h-8 w-auto" />}
          </Link>
          <div className="ml-auto flex items-center desktop:hidden z-10">
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
                activeClassName="underline-navigation"
                className={classnames("text-sm font-light transition-colors duration-500", {
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

        <div
          className={classnames(
            "fixed bg-palette-600 inset-0 px-8 py-12 desktop:hidden transition-all duration-500 transform",
            {
              "translate-x-full": !open,
            }
          )}
          style={{ marginTop: mobileMenuOffset }}
        >
          <ul className="py-10 space-y-2">
            {routes.map(({ title, route }) => (
              <li key={title}>
                <Link key={route} to={route} className="text-xl leading-7 font-semibold text-white">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-palette-500 py-7">
            <Link
              href="https://discordapp.com/invite/sia"
              className="text-palette-300 text-m font-content flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordSmall className="mr-2 fill-current text-white" />
              <span>Join our Discord</span>
            </Link>
          </div>
          <div className="pt-12 pb-8 border-t border-palette-500">
            <div className="flex items-center justify-center px-4 space-x-6">
              <LogInButton className="px-10" />
              <SignUpButton className="px-10" />
            </div>
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
