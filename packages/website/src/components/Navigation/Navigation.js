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
  { title: "Home", to: "/" },
  { title: "About", to: "/about" },
  { title: "Developers", to: "/developers" },
  { title: "News", to: "/news" },
];

const useWindowTop = () => {
  const { y } = useWindowScroll();

  return y <= 0;
};

const Navigation = ({ mode, uri }) => {
  const navRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const windowSize = useWindowSize();
  const isWindowTop = useWindowTop();

  React.useEffect(() => {
    setOpen(false);
  }, [windowSize, setOpen, uri]);

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
      className={classnames("relative px-8 py-6 transition-all duration-500", {
        "bg-white border-b border-palette-200": mode === "light",
        "bg-palette-600 bg-opacity-50": mode === "dark",
        "desktop:py-12": isWindowTop,
      })}
      ref={navRef}
    >
      <div className={classnames("max-w-layout mx-auto")}>
        <div className="flex justify-between">
          <Link to="/" className={classnames("flex flex-shrink-0 items-center")}>
            {mode === "dark" && <LogoWhiteText className="h-8 desktop:h-10" />}
            {mode === "light" && <LogoBlackText className="h-8 desktop:h-10" />}
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
            {routes.map(({ title, to }) => (
              <Link
                key={to}
                to={to}
                activeClassName="underline-primary"
                className={classnames("text-sm font-light transition-colors duration-200 hover:text-primary", {
                  "text-white": mode === "dark",
                  "text-palette-600": mode === "light",
                })}
              >
                {title}
              </Link>
            ))}
            <Link href="https://account.siasky.net" className="button-link-primary">
              Log in
            </Link>
            <Link href="https://account.siasky.net/auth/registration" className="button-primary">
              Sign up
            </Link>
          </div>
        </div>

        <div
          className={classnames(
            "fixed bg-palette-600 inset-0 px-8 py-12 desktop:hidden transition-all duration-300 transform ease-in-out",
            {
              "translate-x-full": !open,
            }
          )}
          style={{ marginTop: mobileMenuOffset }}
        >
          <ul className="py-10 space-y-2">
            {routes.map(({ title, to }) => (
              <li key={title}>
                <Link
                  key={to}
                  to={to}
                  activeClassName="underline-primary"
                  className="text-xl leading-7 font-semibold text-white transition-colors duration-200 hover:text-primary"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-palette-500 py-7">
            <Link
              href="https://discordapp.com/invite/sia"
              className="text-palette-300 text-m font-content flex items-center"
            >
              <DiscordSmall className="mr-2 fill-current text-white" />
              <span>Join our Discord</span>
            </Link>
          </div>
          <div className="pt-12 pb-8 border-t border-palette-500">
            <div className="flex items-center justify-center px-4 space-x-6">
              <Link href="https://account.siasky.net" className="button-secondary-light">
                Log in
              </Link>

              <Link href="https://account.siasky.net/auth/registration" className="button-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navigation.propTypes = {
  mode: PropTypes.oneOf(["dark", "light"]),
  uri: PropTypes.string,
};

Navigation.defaultProps = {
  mode: "dark",
};

export default Navigation;
