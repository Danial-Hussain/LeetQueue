import { createGlobalStyle } from "styled-components"

import { theme } from "./theme"

export const GlobalStyle = createGlobalStyle`
   :root {
      color-scheme: light;
   }

   body {
      margin: 0px;
      width: 100%;
      height: 100%;
      font-size: 12px;
      font-family: ${theme.fontFamily.poppins};
   }

   h1,
   h2,
   h3,
   h4,
   h5,
   h6 {
      font-weight: 700;
      letter-spacing: 0.025em;
      font-family: ${theme.fontFamily.pt_sans};
   }

   a {
      color: ${theme.colors.blue};
   }
`
