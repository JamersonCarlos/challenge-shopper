interface Coordenadas {
  latitude: number;
  longitude: number;
}

export interface ErrorInvalidAddress {
  error_code: string;
  error_description: string;
}

export function isErrorInvalidAddress(data: any): data is ErrorInvalidAddress {
  return (
    data &&
    typeof data.error_code === "string" &&
    typeof data.error_description === "string"
  );
}

interface Review {
  rating: number;
  comment: string;
}

interface Opcao {
  id: number;
  name: string;
  description: string;
  car: string;
  ratePerKm: number;
  minKm: number;
  value: number;
  review: Review;
}

export interface ResultRides {
  origin: Coordenadas;
  destination: Coordenadas;
  distance: number;
  duration: string;
  options: Opcao[];
}
