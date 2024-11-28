import { DriverAttributes } from "../models/driver.model";

export interface ResponseBodyConfirm {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
      id: number;
      name: string;
    };
    value: number;
  }
  
  export interface ResponseBodyRideEstimate {
    origin: {
      latitude: number;
      longitude: number;
    };
    destination: {
      latitude: number;
      longitude: number;
    };
    distance: number;
    duration: string;
    options: Array<DriverAttributes>;
  }