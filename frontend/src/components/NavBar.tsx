import React from "react";
import { NavLink } from "react-router-dom";
import { FaCar, FaHistory, FaUser } from "react-icons/fa";
import "./NavBar.css";

const NavBar = () => {
  return (
    <div className="vertical-menu">
      <h1>ClickMove</h1>
      <nav className="menu">
        <NavLink to={"/"}>
          <FaCar />
          Solicite sua viagem
        </NavLink>
        <NavLink to={"/viagens"}>
          <FaHistory />
          Histórico de Viagens
        </NavLink>
        <NavLink to={"/motoristas"}>
          <FaUser />
          Motoristas Cadastrados
        </NavLink>
      </nav>
    </div>
  );
};

export default NavBar;
