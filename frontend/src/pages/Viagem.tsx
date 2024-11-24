import React from "react";
import "./Viagem.css";

import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Viagem = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAMqYayPsqD8jqBw_dL-aclx-_y2UCbClA",
    libraries: ["places"],
    language: "pt",
  });

  const [mapa, setMapa] = useState<google.maps.Map>();
  const [center, setCenter] = useState({
    lat: -23.541596480067913,
    lng: -46.629363693411726,
  });

  const navigate = useNavigate();
  const mapper = [1];

  return (
    <div className="container-main">
      <div className="cabecalho">
        <h1>Motoristas Disponiveis</h1>
      </div>

      <div className="informations">
        <div className="viagem-container">
          <div className="driver-container">
            <img
              src="https://i.pinimg.com/736x/20/af/45/20af454bc02b9ef32aa40cbd6fa43780.jpg"
              alt="Homer Simpson"
            />
            <div>
              <h2>Informações</h2>
              <p>Nome: Homer Simpson</p>
              <p>Corridas: 250+</p>
              <p>Rating: 4.5</p>
              <p>Registrado desde de 2024</p>
              <button className="btn-visit-profile">Visitar Perfil</button>
            </div>
          </div>
          <div className="vehicle-container">
            <img
              src="https://static.vecteezy.com/ti/fotos-gratis/p1/11445598-velho-carro-de-passageiros-rosa-enferrujado-foto.jpg"
              alt="Homer Simpson"
            />
            <div>
              <h2>Detalhes </h2>
              <p>Nome: Homer Simpson</p>
              <p>Corridas: 250+</p>
              <p>Rating: 4.5</p>
              <p>Registrado desde de 2024</p>
              <button className="btn-visit-profile">Visitar Perfil</button>
            </div>
          </div>
          <div className="informations-container">
            <div className="informations-column">
              <div>
                <h3>Origem</h3>
                <p>Pettah, Bus Stop</p>
                <p>Total Distance: 25km</p>
              </div>
              <div>
                <h3>Destino</h3>
                <p>Dematagoda Bus Stand</p>
                <p>Duration: 30 minutes</p>
              </div>
              <div>
                <h3>Passengers</h3>
                <p>3 adult - 1 child</p>
                <p>Cost: 1525.00</p>
              </div>
            </div>
            {isLoaded && (
              <GoogleMap
                center={center}
                zoom={14}
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0px 0px 30px 30px",
                }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
                onLoad={(map) => setMapa(map)}
              ></GoogleMap>
            )}
          </div>
        </div>
      </div>
      <div className="buttons-container">
        <button
          className="btn-back"
          onClick={() => {
            navigate("/");
          }}
        >
          Voltar
        </button>
        <button className="btn-confirm">Confirmar</button>
      </div>
    </div>
  );
};

export default Viagem;
