import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";

import Connect from "./reactCode/Connect";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <Connect />
  // </React.StrictMode>
);