import React from "react";
import WindowControls from "./components/WindowControls";
import Connect from "./Connect";

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  html {
    background-color: ${
      window.process?.versions["electron"] ? "#00000070" : "#000000"
    };
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyles />

      {window.process?.versions["electron"] && <WindowControls />}

      <Connect />
    </>
  );
};

export default App;
