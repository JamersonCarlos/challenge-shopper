import React, { useEffect, useState } from "react";
import "./NovaCorrida.css";

//Import Utils
import { getRoute } from "../utils/getRoute";

//Interfaces
import { ResultRides } from "../interfaces/resultRide.interface";

//Components
import SearchRideForm from "../components/SearchRideForm";

//Google Maps
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

const NovaCorrida = () => {
  const [mapa, setMapa] = useState<google.maps.Map | null>();
  const [center, setCenter] = useState({
    lat: -23.541596480067913,
    lng: -46.629363693411726,
  });
  const [drivers, setDrivers] = useState<ResultRides>();
  const [directionsResponse, setDirectionsResponse] = useState<
    google.maps.DirectionsResult | undefined
  >();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
      ? process.env.REACT_APP_GOOGLE_API_KEY
      : "",
    libraries: ["places"],
    language: "pt",
  });

  useEffect(() => {
    if (isLoaded) {
      setCenter({
        lat: Number(drivers?.origin.latitude),
        lng: Number(drivers?.origin.longitude),
      });
      // Solicitar a rota entre a origem e o destino
      const origin = {
        lat: Number(drivers?.origin.latitude),
        lng: Number(drivers?.origin.longitude),
      };
      const destination = {
        lat: Number(drivers?.destination.latitude),
        lng: Number(drivers?.destination.longitude),
      };
      getRoute(origin, destination)
        .then((route) => {
          setDirectionsResponse(route);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [drivers, isLoaded]);

  if (!isLoaded) {
    return <div>Carregando mapa...</div>; // Renderize algo enquanto o mapa carrega
  }

  return (
    <div className="search-ride">
      <div className="search-ride-container">
        <SearchRideForm onResult={setDrivers}></SearchRideForm>
        <GoogleMap
          center={center}
          zoom={14}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "0px 50px 50px 0px",
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
      </div>
    </div>
  );
};

export default NovaCorrida;
