export const getRoute = (
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral
  ): Promise<google.maps.DirectionsResult> => {
    return new Promise((resolve, reject) => {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            resolve(result); // Retorna o resultado da rota
          } else {
            reject(`Não foi possível obter a rota: ${status}`); // Retorna o erro caso falhe
          }
        }
      );
    });
  };
  