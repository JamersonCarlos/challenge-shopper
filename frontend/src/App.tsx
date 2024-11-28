import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//Import components
import NavBar from "./components/NavBar";

//Import Pages
import Home from "./pages/Home";
import NovaCorrida from "./pages/NovaCorrida";
import Trips from "./pages/Trips";
import ChooseDriver from "./pages/ChooseDriver";
import Motoristas from "./pages/Motoristas";

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
          <Route
            path="/motoristas-disponiveis"
            element={<ChooseDriver></ChooseDriver>}
          ></Route>
          {/* <Route path="/motoristas" element={<Drivers/>} ></Route> */}
          <Route path="/viagens" element={<Trips></Trips>}></Route>
          <Route path="/motoristas" element={<Motoristas></Motoristas>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
