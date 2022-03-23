import * as React from "react";
import styled from "styled-components";
import { SWRConfig } from "swr";

import { UserProvider } from "../contexts/user";
import { guestsOnly } from "../lib/swrConfig";

const Layout = styled.div.attrs({
  className: "h-screen w-screen bg-black flex",
})`
  background-image: url(/images/auth-bg.svg);
  background-repeat: no-repeat;
  background-position: center center;
`;

const SloganContainer = styled.div.attrs({
  className: "hidden md:flex lg:w-7/12 grow justify-center items-center relative overflow-hidden",
})``;

const Content = styled.div.attrs({
  className: "w-full md:w-5/12 md:max-w-[680px] shrink-0",
})``;

const AuthLayout = ({ children }) => {
  return (
    <>
      <SWRConfig value={guestsOnly}>
        <UserProvider>
          <Layout>
            <SloganContainer className="pl-20 pr-20 lg:pr-30 xl:pr-40">
              <div className="">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl text-white">
                  The decentralized <span className="text-primary">revolution</span> starts with decentralized storage
                </h1>
              </div>
            </SloganContainer>
            <Content>{children}</Content>
          </Layout>
        </UserProvider>
      </SWRConfig>
    </>
  );
};

export default AuthLayout;
