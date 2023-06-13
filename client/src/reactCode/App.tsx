import React, { useState } from "react";
import WindowControls from "./components/WindowControls";
import Connect from "./Connect";

import { createGlobalStyle, GlobalStyleComponent } from "styled-components";

interface StyleProps {
  isFullScreen: boolean;
}

const GlobalStyles = createGlobalStyle<StyleProps>`
  html {
    background-color: ${({ isFullScreen }) =>
      window.process?.versions["electron"] && !isFullScreen
        ? "#00000070"
        : "#000000"};
  }
`;

const App = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      <GlobalStyles isFullScreen={isFullScreen} />

      {window.process?.versions["electron"] && (
        <WindowControls
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        />
      )}

      <div id="app-content">
        <Connect />
      </div>
    </>
  );
};

export default App;
