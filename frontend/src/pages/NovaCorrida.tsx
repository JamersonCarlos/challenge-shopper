import React from "react";
import "./NovaCorrida.css";
import SearchRideForm from "../components/SearchRideForm";
import { useState } from "react";

//Google Maps
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
const center = { lat: -23.541596480067913, lng: -46.629363693411726 };

const NovaCorrida = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAMqYayPsqD8jqBw_dL-aclx-_y2UCbClA",
    libraries: ["places"],
    language: "pt",
  });

  const [mapa, setMapa] = useState<google.maps.Map>();

  if (!isLoaded) {
    return <div>Carregando mapa...</div>; // Renderize algo enquanto o mapa carrega
  }

  return (
    <div className="search-ride">
      <div className="search-ride-container">
        <div className="search-ride-form">
          <SearchRideForm></SearchRideForm>
        </div>
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
          <Marker position={center}></Marker>
        </GoogleMap>
      </div>
    </div>
  );
};

export default NovaCorrida;
