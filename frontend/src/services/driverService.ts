import axios, { AxiosError } from "axios";

//Interface Error
import { ErrorInvalidAddress } from "../interfaces/resultRide.interface";

const url = "http://localhost:8080/";

export const searchDriver = async (
  id: string,
  origin: string,
  destination: string
) => {
  try {
    const response = await axios.post(
      `${url}ride/estimate`,
      {
        id,
        origin,
        destination,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data) {
        const dataError: ErrorInvalidAddress | Object =
          axiosError.response?.data;
        return dataError;
      }
    }
  }
};
