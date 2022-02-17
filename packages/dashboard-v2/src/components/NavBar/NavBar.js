import styled from 'styled-components'

import { PageContainer } from '../PageContainer'

const NavBarContainer = styled.div.attrs({
  className: `grid sticky top-0 bg-white`,
})``

const NavBarBody = styled.nav.attrs({
  className: 'grid h-[80px] font-sans font-light text-sm',
})`
  grid-template-columns: auto max-content 1fr;
`

export const NavBar = (props) => (
  <NavBarContainer>
    <PageContainer>
      <NavBarBody {...props} />
    </PageContainer>
  </NavBarContainer>
)
