import React, { useState } from "react";
import { Icon } from "@iconify/react";

const { ipcRenderer } = window.require
  ? window.require("electron")
  : { ipcRenderer: null };

import styled from "styled-components";

interface StyleProps {
  isFullScreen: boolean;
}

const WindowControlsStyles = styled.div<StyleProps>`
  top: 0;
  height: 35px;
  /* background: ${({ isFullScreen }) =>
    isFullScreen ? "#000000" : "none"}; */
  background: #000000;

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
    border-bottom: 2px solid #202020;

    .window-control-button {
      display: inline-block;
      height: 25px;
      margin: 5px 8px;

      cursor: pointer;

      opacity: 0;
      transform: scale(1);
      transition: opacity 0.3s, transform 0.3s;

      :hover {
        transform: scale(0.8);
      }
    }

    .window-drag-bar {
      flex-grow: 1;
      height: 100%;

      -webkit-app-region: drag;
    }

    :hover {
      .window-control-button {
        opacity: 1;
      }
    }
  }
`;

const WindowControls = ({
  isFullScreen,
  setIsFullScreen,
}: {
  isFullScreen: boolean;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    ipcRenderer && (
      <WindowControlsStyles isFullScreen={isFullScreen}>
        <div className="window-control-bar">
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
                  onClick={() => ipcRenderer.invoke("minimize-current-window")}
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
        </div>
      </WindowControlsStyles>
    )
  );
};

export default WindowControls;
