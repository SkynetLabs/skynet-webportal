import * as React from "react";

const HeroStartPage = () => {
  return (
    <div className="text-center p-8">
      <h1 className="font-semibold text-4xl desktop:text-6xl desktop:leading-16 text-white">
        Build a{" "}
        <span className="text-primary border-b-2 border-white">
          free <br className="desktop:hidden" />
          Internet
        </span>
      </h1>
      <p className="mt-5 font-light text-md leading-7 text-palette-300">
        <span className="hidden desktop:block">Skynet is a content and application hosting platform bringing</span>
        <span className="hidden desktop:block">decentralized storage to users, creators and app developers.</span>
        <span className="desktop:hidden text-justify text-sm">
          Skynet is a content and application hosting platform bringing decentralized storage to users, creators and app
          developers.
        </span>
      </p>
    </div>
  );
};

HeroStartPage.propTypes = {};

HeroStartPage.defaultProps = {};

export default HeroStartPage;
