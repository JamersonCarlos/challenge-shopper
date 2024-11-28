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
  vehicle: string;
  ratePerKm: number;
  minKm: number;
  photoCar?: string;
  photoProfile?: string;
  value: number;
  review: Review;
  registeredSince?: number;
}

export interface ResultRides {
  origin: Coordenadas;
  destination: Coordenadas;
  distance: number;
  duration: string;
  options: Opcao[];
}
