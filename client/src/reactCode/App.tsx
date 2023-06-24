import React, { useState } from "react";
import WindowControls from "./components/WindowControls";
import Connect from "./Connect";

import GlobalStylesProvider from "styles/GlobalStylesProvider";

import { DefaultTheme } from "styled-components";

const App = () => {
  const [theme, setTheme] = useState<DefaultTheme>({
    palette: {
      text: "#ffffff",
      background: "#000000",
      backgroundTransparency: "d0",
      primary: "#444444",
      secondary: "#bbbbbb",
    },
  });
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <GlobalStylesProvider theme={theme} isFullScreen={isFullScreen}>
      {window.process?.versions["electron"] && (
        <WindowControls
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        />
      )}

      <div id="app-content">
        <Connect />

        <span
          style={{
            position: "absolute",
            left: "8px",
            bottom: "8px",
          }}
        >
          {process.env.REACT_APP_VERSION}
        </span>
      </div>
    </GlobalStylesProvider>
  );
};

export default App;
