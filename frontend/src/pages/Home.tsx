import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <div className="apresentacao">
        <p>
          Chegue ao seu destino com conforto e rapidez. Solicite sua corrida
          agora e viva a experiência de viajar sem preocupações!
        </p>
        <button
          className="btn-submit"
          onClick={() => navigate("/solicitar-corrida")}
        >
          Solicitar corrida
        </button>
      </div>
    </div>
  );
};

export default Home;
