import React, { useRef } from "react";
import "./SearchRideForm.css";
import { useState } from "react";
import { FaIdCard, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { Autocomplete } from "@react-google-maps/api";


//Função de verificação
import { isErrorInvalidAddress } from "../interfaces/resultRide.interface";

//Interfaces
import { ResultRides } from "../interfaces/resultRide.interface";

//Components
import Loading from "./Loading";

//Validator de cpf
import { cpf } from "cpf-cnpj-validator";

//Mascara para o input
import InputMask from "react-input-mask";

//Serviço para buscar motorista
import { searchDriver } from "../services/driverService";
interface ChildrenProps {
  onResult: (data: ResultRides) => void;
}

const SearchRideForm: React.FC<ChildrenProps> = ({ onResult }) => {
  //Atributos formulário
  const [cpfValue, setCpfvalue] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  //Carregamento dos dados
  const [loading, setLoading] = useState<boolean>(false);

  //Validatores de entrada
  const [errorCpf, setErrorCpf] = useState<string>("");
  const [errorOrigin, setErrorOrigin] = useState<string>("");
  const [errorDestination, setErrorDestination] = useState<string>("");

  // Referências para o Autocomplete
  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);

  //Validando CPF
  const handleCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: string = e.target.value;

    // Remove formatação para validação
    const stripped: string = cpf.strip(input);

    setCpfvalue(stripped);
    if (stripped.length === 11 && stripped && !cpf.isValid(stripped)) {
      setErrorCpf("CPF inválido. Por favor, verifique os números digitados.");
    } else {
      setErrorCpf("");
    }
  };

  //Enviando formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = await searchDriver(cpfValue, origin, destination);
    if (isErrorInvalidAddress(data)) {
      if (data.error_description === "Endereço de destino inválido") {
        setErrorDestination("Endereço de destino inválido");
      } else {
        setErrorDestination("");
      }
      if (data.error_description === "Endereço de origem inválido") {
        setErrorOrigin("Endereço de origem inválido");
      } else {
        setErrorOrigin("");
      }
    } else {
      setErrorDestination("");
      setErrorOrigin("");
      onResult(data);
    }
    setLoading(false);
  };

  //Adiciona o valor do autocomplete a variável responsável por armazenar a origem
  const handleOriginChanged = (
    autocomplete: google.maps.places.Autocomplete,
    setPlace: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const place = autocomplete.getPlace();
    if (place && place.formatted_address) {
      setPlace(place.formatted_address); // Armazena o endereço selecionado
    }
  };

  //Adiciona o valor do autocomplete a variável responsável por armazenar o destino
  const handleDestinationChanged = (
    autocomplete: google.maps.places.Autocomplete,
    setPlace: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const place = autocomplete.getPlace();
    if (place && place.formatted_address) {
      setPlace(place.formatted_address); // Armazena o endereço selecionado
    }
  };

  //Habilita o botão quando todos os campos forem preenchidos corretamente
  const isFormValid = () => {
    const isCpfValid = errorCpf === ""; // Se não houver erro de CPF
    const isExistCpf = cpfValue !== ""; // Se o campo cpf não está vazio
    const isOriginValid = origin.trim() !== ""; // Se o campo de origem não está vazio
    const isDestinationValid = destination.trim() !== ""; // Se o campo de destino não está vazio
    return isExistCpf && isCpfValid && isOriginValid && isDestinationValid;
  };

  return (
    <div className="search-ride-form">
      {loading && <Loading></Loading>}
      {!loading && (
        <div>
          <h2>Buscar Motorista</h2>
          <form onSubmit={handleSubmit}>
            <label>
              <span>CPF</span>
              <div className="input-container">
                {/* Utilizando máscara para receber CPF/PK */}
                <InputMask
                  mask={"999.999.999-99"}
                  value={cpfValue}
                  name="cpf"
                  placeholder="999.999.999-99"
                  onChange={handleCpf}
                ></InputMask>
                <FaIdCard className="icon-right" />
              </div>
              {errorCpf && <p className="error-text">{errorCpf}</p>}
            </label>

            <label>
              <span>Origem</span>
              <div className="input-container">
                <Autocomplete
                  onLoad={(autocomplete) => (originRef.current = autocomplete)}
                  onPlaceChanged={() =>
                    handleOriginChanged(originRef.current!, setOrigin)
                  }
                >
                  <input
                    type="text"
                    name="origem"
                    placeholder="Endereço de origem"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </Autocomplete>
                <FaMapMarkerAlt className="icon-right" />{" "}
                {errorOrigin && <p className="error-text">{errorOrigin}</p>}
              </div>
            </label>

            <label>
              <span>Destino</span>
              <div className="input-container">
                <Autocomplete
                  onLoad={(autocomplete) =>
                    (destinationRef.current = autocomplete)
                  }
                  onPlaceChanged={() =>
                    handleDestinationChanged(
                      destinationRef.current!,
                      setDestination
                    )
                  }
                >
                  <input
                    type="text"
                    name="destino"
                    placeholder="Endereço do destino"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </Autocomplete>
                <FaLocationArrow className="icon-right" />{" "}
                {errorDestination && (
                  <p className="error-text">{errorDestination}</p>
                )}
              </div>
            </label>

            <input type="submit" value="Buscar" disabled={!isFormValid()} />
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchRideForm;
