import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={MainPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
