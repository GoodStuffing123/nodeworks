import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.scss";

import App from "./reactCode/App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
