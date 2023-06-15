import "styled-components";

interface AppPalette {
  text: string;
  background: string;
  backgroundTransparency: string;
  primary: string;
  secondary: string;
}

declare module "styled-components" {
  export interface DefaultTheme {
    palette: AppPalette;
  }
}
