import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

const Router = (props: any) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage {...props} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
