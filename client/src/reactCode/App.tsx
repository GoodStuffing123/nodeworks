import React, { useState } from "react";
import WindowControls from "./components/WindowControls";
import Connect from "./Connect";

import GlobalStylesProvider from "styles/GlobalStylesProvider";

import { DefaultTheme } from "styled-components";
import themes from "../lib/themes";

const App = () => {
  const [theme, setTheme] = useState<DefaultTheme>(themes[0].theme);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <GlobalStylesProvider theme={theme} isFullScreen={isFullScreen}>
      <WindowControls
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        setTheme={setTheme}
        theme={theme}
      />

      <div id="app-content">
        <Connect theme={theme} />

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

      <div id="app-background"></div>
    </GlobalStylesProvider>
  );
};

export default App;
