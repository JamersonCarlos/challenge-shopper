import React from "react";
import "./Home.css";
import { useState } from "react";
import SearchRideForm from "../components/SearchRideForm";

//Google Maps
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
const center = { lat: -23.541596480067913, lng: -46.629363693411726 };

const Home: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAMqYayPsqD8jqBw_dL-aclx-_y2UCbClA",
    libraries: ["places"],
    language: "pt",
  });

  const [state, setState] = useState<boolean>(true);
  const [mapa, setMapa] = useState<google.maps.Map>();
  return (
    <div className="home-container">
      {state && (
        <div className="apresentacao">
          <p>
            Chegue ao seu destino com conforto e rapidez. Solicite sua corrida
            agora e viva a experiência de viajar sem preocupações!
          </p>
          <button className="btn-submit" onClick={() => setState(!state)}>
            Solicitar corrida
          </button>
        </div>
      )}
      {!state && (
        <div className="search-ride-container">
          <div className="search-ride-form">
            <h2>Buscar Motorista</h2>
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
      )}
    </div>
  );
};

export default Home;
