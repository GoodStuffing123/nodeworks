import { DefaultTheme } from "styled-components";

interface ThemeSelection {
  title: string;
  theme: DefaultTheme;
}

const defaultTheme: DefaultTheme = {
  palette: {
    text: "#ffffff",
    background: "#000000",
    backgroundTransparency: "d0",
    primary: "#444444",
    secondary: "#bbbbbb",
    tertiary: "#202020",
  },
};

const themes: ThemeSelection[] = [
  {
    title: "Abyss",
    theme: {
      ...defaultTheme,

      palette: {
        ...defaultTheme.palette,
      },
    },
  },

  {
    title: "ISS",
    theme: {
      ...defaultTheme,

      palette: {
        ...defaultTheme.palette,

        text: "#000000",
        background: "#ffffff",
        backgroundTransparency: "cc",
        primary: "#9c9c9c",
        secondary: "#444444",
        tertiary: "#cccccc",
      },
    },
  },

  {
    title: "Marse",
    theme: {
      ...defaultTheme,

      palette: {
        ...defaultTheme.palette,

        text: "#652727",
        background: "#ebbbba",
        backgroundTransparency: "c0",
        primary: "#a35b45",
        secondary: "#603e21",
        tertiary: "#d67f7e",
      },
    },
  },

  {
    title: "Neptune",
    theme: {
      ...defaultTheme,

      palette: {
        ...defaultTheme.palette,

        text: "#b5beff",
        background: "#111562",
        backgroundTransparency: "b0",
        primary: "#4548a3",
        secondary: "#302160",
        tertiary: "#7e84d6",
      },
    },
  },
];

export default themes;
