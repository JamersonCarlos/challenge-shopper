import React, { useEffect } from "react";
import "./ChooseDriver.css";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import { FiAlertOctagon } from "react-icons/fi";

//Google Maps
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

//Services
import { confirmTrip } from "../services/tripService";

//Interfaces
import { NavigationState } from "../interfaces/routesData.interface";

//Função para capturar a rota de um ponto a outro
import { getRoute } from "../utils/getRoute";
import { Trip } from "../interfaces/trip.interface";

const ChooseDriver: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
      ? process.env.REACT_APP_GOOGLE_API_KEY
      : "",
    libraries: ["places"],
    language: "pt",
  });

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

  //ConfirmOperation
  const [showConfirmation, setShowConfirmation] = useState(false);

  //Carregamento de dados recebidos via router
  const dataRouter: NavigationState = location.state;
  const drivers = dataRouter.data.options;

  //Confirmar viagem
  const handleConfirm = async (
    id_driver: number,
    name_driver: string,
    value: number
  ) => {
    const newTrip: Trip = {
      customer_id: dataRouter.id,
      destination: dataRouter.destination,
      origin: dataRouter.origin,
      distance: dataRouter.data.distance,
      duration: dataRouter.data.duration,
      driver: {
        id: id_driver,
        name: name_driver,
      },
      value: value,
    };

    const response = await confirmTrip(newTrip);
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
            Viagem Confirmada!{" "}
            <FiAlertOctagon className="icon-alert"></FiAlertOctagon>
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
      <div>
        {drivers.map((driver) => (
          <div className="trip-info-container">
            <div className="viagem-container">
              <div className="driver-container">
                <img src={driver.photoProfile} alt={driver.name} />
                <div>
                  <p>{driver.description}</p>
                  <p>Registrado desde de {driver.registeredSince}</p>
                </div>
              </div>
              <div className="vehicle-reviews-container">
                <div className="vehicle-container">
                  <img src={driver.photoCar} alt="Carro" />
                  <div>
                    <p>Modelo: {driver.vehicle}</p>
                  </div>
                </div>
                <div className="review-container">
                  <p className="title-reviews">
                    Avaliações: {driver.review.rating}/5{" "}
                    <FaRegStar className="star-icon"></FaRegStar>
                  </p>
                  <p>{driver.review.comment}</p>
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
                    <p>Valor: R${driver.value.toFixed(2)}</p>
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
                      gestureHandling: "none",
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
            <div
              className="btn-confirm btn-confirm-driver"
              onClick={() =>
                handleConfirm(driver.id, driver.name, driver.value)
              }
            >
              <p>{`Viajar com ${driver.name}`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseDriver;
