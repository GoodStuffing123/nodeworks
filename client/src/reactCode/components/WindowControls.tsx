import React, { Dispatch, SetStateAction, useState } from "react";
import { Icon } from "@iconify/react";

const { ipcRenderer } = window.require
  ? window.require("electron")
  : { ipcRenderer: null };

import themes from "lib/themes";
import styled, { DefaultTheme } from "styled-components";

interface StyleProps {
  isFullScreen: boolean;
}

const WindowControlsStyles = styled.div<StyleProps>`
  .window-control-bar-container {
    height: 35px;
    z-index: 9999;

    .window-control-bar {
      display: flex;
      position: absolute;
      left: 0;
      top: 0;

      width: 100vw;
      height: 35px;

      padding: 0;
      margin: 0;

      /* background-color: #202020; */
      background-color: ${({ theme }) => theme.palette.background};
      border-bottom: 2px solid ${({ theme }) => theme.palette.primary};

      .window-control-button {
        display: inline-block;
        height: 25px;
        margin: 5px 8px;

        cursor: pointer;

        /* opacity: 0; */
        transform: scale(1);
        transition: transform 0.3s;

        :hover {
          transform: scale(0.8);
        }
      }

      .window-drag-bar {
        flex-grow: 1;
        height: 100%;

        -webkit-app-region: drag;
      }

      /* :hover {
      .window-control-button {
        opacity: 1;
      }
    } */
    }
  }

  .theme-selector-dropdown {
    position: absolute;
    right: 5px;
    top: 40px;

    border: 1px solid ${({ theme }) => theme.palette.primary};
    border-radius: 10px;
    overflow: hidden;

    z-index: 0;

    transition: transform 0.5s ease-out;

    &.closed {
      transform: translateY(calc(-100% - 40px));
    }

    &.open {
      transform: translateY(0%);
    }

    p {
      margin: 0;
      padding: 5px;
      cursor: pointer;

      background-color: ${({ theme }) => theme.palette.tertiary};
      transition: background-color 0.3s;

      :hover,
      &.active {
        background-color: ${({ theme }) => theme.palette.primary};
      }
    }
  }
`;

const WindowControls = ({
  isFullScreen,
  setIsFullScreen,
  setTheme,
  theme,
}: {
  isFullScreen: boolean;
  setIsFullScreen: Dispatch<SetStateAction<boolean>>;
  setTheme: Dispatch<SetStateAction<DefaultTheme>>;
  theme: DefaultTheme;
}) => {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  return (
    <WindowControlsStyles isFullScreen={isFullScreen}>
      <div
        className={`theme-selector-dropdown ${
          themeDropdownOpen ? "open" : "closed"
        }`}
      >
        {themes.map((themeSelection) => (
          <p
            key={themeSelection.title}
            onClick={() => setTheme(themeSelection.theme)}
            className={theme === themeSelection.theme ? "active" : ""}
          >
            {themeSelection.title}
          </p>
        ))}
      </div>

      <div className="window-control-bar-container">
        <div className="window-control-bar">
          {ipcRenderer && window.process?.versions["electron"] && (
            <>
              <div className="window-control-button">
                <Icon
                  icon="teenyicons:x-solid"
                  height="100%"
                  onClick={() => ipcRenderer.invoke("close-current-window")}
                />
              </div>

              {!isFullScreen ? (
                <>
                  <div className="window-control-button">
                    <Icon
                      icon="teenyicons:arrow-down-solid"
                      height="100%"
                      onClick={() =>
                        ipcRenderer.invoke("minimize-current-window")
                      }
                    />
                  </div>

                  <div className="window-control-button">
                    <Icon
                      icon="teenyicons:expand-alt-solid"
                      height="100%"
                      onClick={() =>
                        ipcRenderer
                          .invoke("toggle-full-screen-current-window")
                          .then((isFullscreen: boolean) =>
                            setIsFullScreen(isFullscreen),
                          )
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="window-control-button">
                  <Icon
                    icon="teenyicons:minimise-alt-solid"
                    height="100%"
                    onClick={() =>
                      ipcRenderer
                        .invoke("toggle-full-screen-current-window")
                        .then((isFullscreen: boolean) =>
                          setIsFullScreen(isFullscreen),
                        )
                    }
                  />
                </div>
              )}

              <div className="window-drag-bar"></div>
            </>
          )}

          <div className="window-control-button" style={{ marginLeft: "auto" }}>
            <Icon
              icon="teenyicons:image-solid"
              height="100%"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            />
          </div>
        </div>
      </div>
    </WindowControlsStyles>
  );
};

export default WindowControls;
