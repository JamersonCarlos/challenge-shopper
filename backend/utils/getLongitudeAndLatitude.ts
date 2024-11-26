//Google Maps
import { Client } from "@googlemaps/google-maps-services-js";

//Interface Coordenadas 
import { coordinatesInterface } from "../interfaces/coordinatesInterface";

import dotenv from "dotenv";
dotenv.config();

const getLatLng = async (address: string, client: Client ):Promise<coordinatesInterface> => {
    try {
      const geocodeResponse = await client.geocode({
        params: {
          address,
          key: process.env.GOOGLE_API_KEY!,
        },
      });
      
      //Se não retornar nada, o endereço é invalido!
      if (geocodeResponse.data.results.length === 0) {
        throw new Error("Unable to geocode address");
      }
  
      const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } catch (error) {
      throw new Error(`Error fetching latitude and longitude: ${(error instanceof Error) ? error.message : ""}`);
    }
  };

export default getLatLng; 