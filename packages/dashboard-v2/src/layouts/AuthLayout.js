import * as React from "react";
import styled from "styled-components";

import { UserProvider } from "../contexts/user";

import skynetLogo from "../../static/images/logo-black-text.svg";
import authBg from "../../static/images/auth-bg.svg";

const Layout = styled.div.attrs({
  className: "min-h-screen w-screen bg-black flex",
})`
  background-image: url(${authBg});
  background-repeat: no-repeat;
  background-position: center center;
`;

const SloganContainer = styled.div.attrs({
  className: "hidden md:flex lg:w-7/12 grow justify-center items-center relative overflow-hidden",
})``;

const Content = styled.div.attrs({
  className: "w-full md:w-5/12 md:max-w-[680px] shrink-0",
})``;

const AuthLayout =
  (userProviderProps) =>
  ({ children }) =>
    (
      <>
        <UserProvider {...userProviderProps}>
          <Layout>
            <SloganContainer className="pl-20 pr-20 lg:pr-30 xl:pr-40">
              <div className="">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl text-white">
                  The decentralized <span className="text-primary">revolution</span> starts with decentralized storage
                </h1>
              </div>
            </SloganContainer>
            <Content>
              <div className="bg-white px-8 py-10 md:py-32 lg:px-16 xl:px-28 min-h-screen">
                <div className="mb-4 md:mb-16">
                  <img src={skynetLogo} alt="Skynet" className="-ml-2" />
                </div>
                {children}
              </div>
            </Content>
          </Layout>
        </UserProvider>
      </>
    );

// Some pages (e.g. email confirmation) need to be accessible to both logged-in and guest users.
export const AllUsersAuthLayout = AuthLayout({
  allowGuests: true,
  allowAuthenticated: true,
});

export default AuthLayout({
  allowGuests: true,
  allowAuthenticated: false,
});
