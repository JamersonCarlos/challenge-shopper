import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//Import components
import NavBar from "./components/NavBar";

//Import Pages
import Home from "./pages/Home";
import NovaCorrida from "./pages/NovaCorrida";
import Drivers from "./pages/Drivers";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route
            path="/solicitar-corrida"
            element={<NovaCorrida></NovaCorrida>}
          ></Route>
          <Route path="/drivers" element={<Drivers></Drivers>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
