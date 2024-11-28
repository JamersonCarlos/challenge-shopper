export interface Trip {
  origin: string;
  destination: string;
  customer_id: string;
  value: number;
  distance: number;
  driver: {
    id: number, 
    name: string
  }
  duration: string;
  createdAt?: string; 
}

export interface responseSearchTrips { 
  customer_id: string, 
  rides: Array<Trip>,
  error_code?: string,
}
