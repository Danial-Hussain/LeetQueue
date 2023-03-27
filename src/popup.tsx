import "@fontsource/poppins"
import "@fontsource/pt-sans"

import { useState } from "react"
import styled from "styled-components"
import { ThemeProvider } from "styled-components"

import { AddToQueue } from "~components/AddToQueue"
import { TabManager } from "~components/TabManager"
import { ViewQueue } from "~components/ViewQueue"
import { EXT_NAME } from "~constants"
import { GlobalStyle } from "~styles/global"
import { theme } from "~styles/theme"

export type Tab = "View" | "Add"

const IndexPopup = () => {
  const [tab, setTab] = useState<Tab>("View")

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Popup>
          <Header>
            <Name>{EXT_NAME}</Name>
          </Header>
          <Body>
            <TabManager tab={tab} setTab={setTab} />
            {tab === "View" ? <ViewQueue setTab={setTab} /> : <AddToQueue />}
          </Body>
        </Popup>
      </ThemeProvider>
    </>
  )
}

const Popup = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.gray};
  background: ${(p) => p.theme.colors.off_white};
`

const Name = styled.h1`
  font-size: 32px;
  display: block;
  position: relative;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 12px 0px 12px;
`

export default IndexPopup
