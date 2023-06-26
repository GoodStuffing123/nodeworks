import React from "react";

import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider,
} from "styled-components";

interface StyleProps {
  isFullScreen: boolean;
}

const GlobalStyles = createGlobalStyle<StyleProps>`
  /* Global */

  * {
    transition: background-color 0.5s;
  }

  html {
    font-family: sans-serif;
    background: none;
    color: ${({ theme }) => theme.palette.text};
    overflow: hidden;
  }

  body {
    margin: 0;
    padding: 0;
  }

  #app-content {
    padding: 0 5vw;
    margin-top: 10px;
    overflow-y: scroll;
  }

  #app-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    background-color: ${({ theme, isFullScreen }) =>
      theme.palette.background +
      (window.process?.versions["electron"] && !isFullScreen
        ? theme.palette.backgroundTransparency
        : "")};

    z-index: -9999;
  }

  /* Interactable Elements */

  input[type="text"],
  textarea {
    font-size: medium;
    background: none;
    color: ${({ theme }) => theme.palette.text};

    border: none;
    border-bottom: 2px solid ${({ theme }) => theme.palette.primary};
    outline: none;

    transition: border-bottom 0.4s;

    &:focus {
      border-bottom: 2px solid ${({ theme }) => theme.palette.secondary};
    }

    &::placeholder {
      color: ${({ theme }) => theme.palette.primary};
    }
  }

  textarea {
    resize: none;
  }

  button {
    margin: 5px;

    font-size: medium;
    background: none;
    color: ${({ theme }) => theme.palette.text};

    border: none;
    border-top: 2px solid ${({ theme }) => theme.palette.primary};
    border-bottom: 2px solid ${({ theme }) => theme.palette.primary};

    transition: border 0.4s;

    &:hover {
      border-top: 2px solid ${({ theme }) => theme.palette.secondary};
      border-bottom: 2px solid ${({ theme }) => theme.palette.secondary};
    }
  }

  /* Scrollbars */

  ::-webkit-scrollbar {
    background: none;
  }

  ::-webkit-scrollbar-corner {
    background: none;
  }

  /* Containers */

  .bordered-container {
    margin: 20px;
    padding: 20px;

    border: none;
    border-top: 1px solid ${({ theme }) => theme.palette.primary};
    border-bottom: 1px solid ${({ theme }) => theme.palette.primary};

    transition: padding 0.4s;

    &:hover {
      padding: 23px 20px;
    }
  }

  .verticle-bordered-container {
    margin: 20px;
    padding: 20px;

    border: none;
    border-left: 1px solid ${({ theme }) => theme.palette.primary};
    border-right: 1px solid ${({ theme }) => theme.palette.primary};
  }

  /* Animation */

  @keyframes popup-animation {
    from {
      transform: translateY(20px);
      opacity: 0;
    }

    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  .popup-animation {
    transform: translateY(20px);
    opacity: 0;

    animation: popup-animation 0.5s ease-out forwards;
  }

  .delay-1 {
    animation-delay: 0.1s;
  }

  .delay-2 {
    animation-delay: 0.2s;
  }

  .delay-3 {
    animation-delay: 0.3s;
  }

  .delay-4 {
    animation-delay: 0.4s;
  }

  .delay-5 {
    animation-delay: 0.5s;
  }

  .delay-6 {
    animation-delay: 0.6s;
  }

  .delay-7 {
    animation-delay: 0.7s;
  }

  .delay-8 {
    animation-delay: 0.8s;
  }

  .delay-9 {
    animation-delay: 0.9s;
  }
`;

const GlobalStylesProvider = ({
  theme,
  isFullScreen,
  children,
}: {
  theme: DefaultTheme;
  isFullScreen: boolean;
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles isFullScreen={isFullScreen} />

      {children}
    </ThemeProvider>
  );
};

export default GlobalStylesProvider;
