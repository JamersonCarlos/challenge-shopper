import { ResultRides } from "./resultRide.interface"


//Interface pra enviar dados via navigate 
export interface NavigationState { 
    data: ResultRides, 
    origin: string, 
    destination: string 
  }