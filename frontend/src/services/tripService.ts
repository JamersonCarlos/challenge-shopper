import axios, { AxiosError } from "axios";
import { responseSearchTrips, Trip } from "../interfaces/trip.interface";
import { searchTripsInterface } from "../interfaces/searchTrip.interface";

const url = "http://localhost:8080/";

export const confirmTrip = async (trip: Trip) => {
  try {
    const response = await axios.patch(`${url}ride/confirm`, trip, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const searchTrips = async (search: searchTripsInterface) => {
  try {
    let searchUrl = "";
    if (search.driver_id && search.driver_id !== 0) {
      searchUrl = `${url}ride/${search.customer_id}?driver_id=${search.driver_id}`;
    } else {
      searchUrl = `${url}ride/${search.customer_id}`;
    }
    const response = await axios.get(searchUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data) {
        const dataError: Object = axiosError.response?.data;
        return dataError;
      }
    }
  }
};

export const listTrips = async ():Promise<responseSearchTrips | undefined> => {
  try {
    const response = await axios.get(`${url}trips`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; 
  } catch (error) {
    console.log(error);
  }
};
