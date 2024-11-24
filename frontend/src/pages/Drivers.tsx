import React, { useEffect } from "react";
import "./Drivers.css";

import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaRegStar } from "react-icons/fa";
import { FiAlertOctagon } from "react-icons/fi";

//Services
import { confirmTrip } from "../services/tripService";

//Interfaces
import { NavigationState } from "../interfaces/routesData.interface";

//Função para capturar a rota de um ponto a outro
import { getRoute } from "../utils/getRoute";
import { Trip } from "../interfaces/trip.interface";

const Viagem = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAMqYayPsqD8jqBw_dL-aclx-_y2UCbClA",
    libraries: ["places"],
    language: "pt",
  });

  //ConfirmOperation
  const [showConfirmation, setShowConfirmation] = useState(false);

  //Roteamento
  const navigate = useNavigate();
  const location = useLocation();

  const [directionsResponse, setDirectionsResponse] = useState<
    google.maps.DirectionsResult | undefined
  >();

  const [mapa, setMapa] = useState<google.maps.Map>();
  const [center, setCenter] = useState({
    lat: -23.541596480067913,
    lng: -46.629363693411726,
  });

  //Carregamento de dados recebidos via router
  const dataRouter: NavigationState = location.state;
  const drivers = dataRouter.data.options;

  //Navegação variáveis e funções
  const [indexDriver, setIndexDriver] = useState(0);
  const [driverUse, setDriverUse] = useState(drivers[0]);
  const [maxPage, setMaxPage] = useState(drivers.length - 1);

  const nextPage = () => {
    setDriverUse(drivers[indexDriver + 1]);
    setIndexDriver(indexDriver + 1);
  };

  const backPage = () => {
    if (indexDriver > 0) {
      setDriverUse(drivers[indexDriver - 1]);
      setIndexDriver(indexDriver - 1);
    }
  };

  //Confirmar viagem
  const handleConfirm = async () => {
    const newTrip: Trip = {
      customer_id: dataRouter.id,
      destination: dataRouter.destination,
      origin: dataRouter.origin,
      distance: dataRouter.data.distance,
      duration: dataRouter.data.duration,
      driver: {
        id: driverUse.id,
        name: driverUse.name,
      },
      value: driverUse.value,
    };

    const response = await confirmTrip(newTrip);
    console.log(response);
    if (response.success) {
      setShowConfirmation(true);
      setTimeout(() => navigate("/viagens"), 3000);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      setCenter({
        lat: dataRouter?.data.origin.latitude,
        lng: dataRouter?.data.origin.longitude,
      });
      // Solicitar a rota entre a origem e o destino
      const origin = {
        lat: dataRouter?.data.origin.latitude,
        lng: dataRouter?.data.origin.longitude,
      };
      const destination = {
        lat: dataRouter?.data.destination.latitude,
        lng: dataRouter?.data.destination.longitude,
      };
      getRoute(origin, destination)
        .then((route) => {
          setDirectionsResponse(route);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [dataRouter, isLoaded]);

  return (
    <div className="container-main">
      {/* Card confirmação de operação */}
      {showConfirmation && (
        <div className="confirmation-card">
          <h2>
            Viagem Confirmada! <FiAlertOctagon className="icon-alert"></FiAlertOctagon>
          </h2>
          <p>
            A viagem foi confirmada com sucesso. Em breve, você será
            redirecionado para a página de viagens.
          </p>
        </div>
      )}
      <div className="cabecalho">
        <h1>Motoristas Disponiveis</h1>
      </div>
      <div className="informations">
        <FaChevronLeft
          className={indexDriver !== 0 ? "btn-scroll" : "btn-scroll disable"}
          onClick={backPage}
        ></FaChevronLeft>
        <div className="viagem-container">
          <div className="driver-container">
            <img src={driverUse.photoProfile} alt={driverUse.name} />
            <div>
              <p>{driverUse.description}</p>
              <p>Registrado desde de {driverUse.registeredSince}</p>
            </div>
          </div>
          <div className="vehicle-reviews-container">
            <div className="vehicle-container">
              <img src={driverUse.photoCar} alt="Carro" />
              <div>
                <p>Modelo: {driverUse.vehicle}</p>
              </div>
            </div>
            <div className="review-container">
              <p className="title-reviews">
                Avaliações: {driverUse.review.rating}/5{" "}
                <FaRegStar className="star-icon"></FaRegStar>
              </p>
              <p>{driverUse.review.comment}</p>
            </div>
          </div>
          <div className="informations-container">
            <div className="informations-column">
              <div>
                <h3>Origem</h3>
                <p>{dataRouter.origin}</p>
              </div>
              <div>
                <h3>Destino</h3>
                <p>{dataRouter.destination}</p>
              </div>
              <div className="details-container">
                <p>Distância Total: {dataRouter.data.distance} km</p>
                <p>Duração: {dataRouter.data.duration}</p>
                <p>Valor: R${driverUse.value}</p>
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
              >
                {directionsResponse && (
                  <DirectionsRenderer
                    directions={directionsResponse}
                  ></DirectionsRenderer>
                )}
              </GoogleMap>
            )}
          </div>
        </div>
        <FaChevronRight
          className={
            indexDriver < maxPage ? "btn-scroll" : "btn-scroll disable"
          }
          onClick={nextPage}
        ></FaChevronRight>
      </div>
      <div className="pages-indicator-container">
        <div className="indicator-driver">
          {dataRouter.data.options.map((driver, i) => (
            <p
              style={{
                background: i === indexDriver ? "#ff9900" : "",
                color: i === indexDriver ? "white" : "",
              }}
            >
              {i + 1}
            </p>
          ))}
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
          <button className="btn-confirm" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Viagem;
