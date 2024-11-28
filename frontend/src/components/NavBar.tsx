import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCar, FaHistory, FaUser } from "react-icons/fa";

import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="vertical-menu">
      <h1 onClick={() => navigate('/')}>ClickMove</h1>
      <nav className="menu">
        <NavLink to={"/solicitar-corrida"}>
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
