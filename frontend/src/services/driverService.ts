import axios, { AxiosError } from "axios";

//Interface Error
import { ErrorInvalidAddress } from "../interfaces/resultRide.interface";
import { Driver } from "../interfaces/driver.interface";

const url = process.env.REACT_APP_API_URL;

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

export const listDrivers = async (): Promise<Driver[] | undefined> => {
  try {
    const response = await axios.get<Driver[]>(`${url}drivers`, {
      headers: { 
        "Content-Type": "application/json",
      },
    });
    const result: Array<Driver> = response.data; 
    return result; 
  } catch (error) {
    console.log(error); 
  }
};
