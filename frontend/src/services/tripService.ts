import axios, { AxiosError } from "axios";
import { Trip } from "../interfaces/trip.interface";

const url = "http://localhost:8080/";

export const confirmTrip = async (trip: Trip) => {
  try {
    const response = await axios.post(`${url}ride/confirm`, trip, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
