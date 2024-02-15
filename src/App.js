import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter className="App">
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
