import styled from "styled-components"

import type { Tab } from "~popup"

export interface Props {
  tab: Tab
  setTab: (tab: Tab) => void
}

export const TabManager: React.FC<Props> = ({ tab, setTab }) => {
  return (
    <Container>
      <TabButton selected={tab === "View"} onClick={() => setTab("View")}>
        <TabButtonText>{"View Queue"}</TabButtonText>
      </TabButton>
      <TabButton selected={tab === "Add"} onClick={() => setTab("Add")}>
        <TabButtonText>{"Add to Queue"}</TabButtonText>
      </TabButton>
    </Container>
  )
}

const Container = styled.div`
  gap: 8px;
  padding: 5px;
  display: flex;
  justify-between;
  border-radius: 8px;
  flex-direction: row;
  background: ${(p) => p.theme.colors.off_white};
`

const TabButton = styled.div<{ selected: boolean }>`
  flex-grow: 1;
  display: flex;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  flex-direction: column;
  padding: 8px 0px 8px 0px;
  background: ${(p) => (p.selected ? p.theme.colors.white : "transparent")};
  &:hover {
    transition-property: all;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    background: ${(p) => p.theme.colors.white};
  }
`

const TabButtonText = styled.div`
  text-align: center;
  font-size: 16px;
`
