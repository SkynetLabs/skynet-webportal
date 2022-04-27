import * as React from "react";
import styled from "styled-components";

import { PageContainer } from "../PageContainer";

const FooterLink = styled.a.attrs({
  className: "text-palette-400 underline decoration-dotted decoration-offset-4 decoration-1",
  rel: "noreferrer",
  target: "_blank",
})``;

export const Footer = () => (
  <PageContainer className="font-content text-palette-300 py-4">
    <p>
      Made by <FooterLink href="https://skynetlabs.com">Skynet Labs</FooterLink>. Open-sourced{" "}
      <FooterLink href="https://github.com/SkynetLabs/skynet-webportal">on Github</FooterLink>.
    </p>
  </PageContainer>
);
