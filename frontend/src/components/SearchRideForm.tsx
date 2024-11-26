import React, { useRef } from "react";
import "./SearchRideForm.css";
import { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

//Icons
import { FaIdCard, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlinePersonSearch } from "react-icons/md";

//Função de verificação
import { isErrorInvalidAddress } from "../interfaces/resultRide.interface";

//Interfaces
import { ResultRides } from "../interfaces/resultRide.interface";
import { NavigationState } from "../interfaces/routesData.interface";

//Components
import Loading from "./Loading";

//Validator de cpf
import { cpf } from "cpf-cnpj-validator";

//Mascara para o input
import InputMask from "react-input-mask";

//Serviço para buscar motorista
import { searchDriver } from "../services/driverService";
import { useNavigate } from "react-router-dom";
interface ChildrenProps {
  onResult: (data: ResultRides) => void;
}

const SearchRideForm: React.FC<ChildrenProps> = ({ onResult }) => {
  //Instância para navegação
  const navigate = useNavigate();

  //Atributos formulário
  const [cpfValue, setCpfvalue] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  //Dados obtidos da API
  const [result, setResult] = useState<ResultRides | null>(null);

  //Carregamento dos dados
  const [loading, setLoading] = useState<boolean>(false);

  //Validatores de entrada
  const [errorCpf, setErrorCpf] = useState<string>(""); //CPF invalido
  const [errorOrigin, setErrorOrigin] = useState<string>(""); //Endereço de origem invalido
  const [errorDestination, setErrorDestination] = useState<string>(""); //Endereço de destino invalido
  const [addressEqualError, setAddressEqualError] = useState<string>(""); //Endereços de origem e destino iguais

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
        setErrorDestination(data.error_description);
      } else {
        setErrorDestination("");
      }
      if (data.error_description === "Endereço de origem inválido") {
        setErrorOrigin(data.error_description);
      } else {
        setErrorOrigin("");
      }
      if (
        data.error_description ===
        "Os endereços de origem e destino não podem ser iguais!!!"
      ) {
        setAddressEqualError(data.error_description);
      }
    } else {
      setErrorDestination("");
      setErrorOrigin("");
      setResult(data);
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

  //Limpando endereços de origem e destino
  const clearOriginDestination = () => {
    setResult(null);
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
        <div className="form-container">
          <div className="header-form">
            <h2>Buscar Motorista</h2>
            <MdOutlinePersonSearch className="icon-search"></MdOutlinePersonSearch>
          </div>
          <form onSubmit={handleSubmit} className="form-ride">
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
                    readOnly={result ? true : false}
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
                    readOnly={result ? true : false}
                  />
                </Autocomplete>
                <FaLocationArrow className="icon-right" />{" "}
                {errorDestination && (
                  <p className="error-text">{errorDestination}</p>
                )}
              </div>
            </label>
            {result && (
              <div className="preview-results-container">
                <div className="results">
                  <p>Distância: {result.distance} km</p>
                  <p>Duração: {result.duration}</p>
                </div>
                <div className="buttons-container">
                  <button className="btn-back" onClick={clearOriginDestination}>
                    Editar
                  </button>
                  <button
                    className="btn-confirm"
                    onClick={() => {
                      navigate("/motoristas-disponiveis", {
                        state: {
                          data: result,
                          origin: origin,
                          destination: destination,
                          id: cpfValue,
                        } as NavigationState,
                      });
                    }}
                  >
                    Escolher Motorista
                  </button>
                </div>
              </div>
            )}
            {addressEqualError && (
              <div className="card-error">
                <p>Os endereços de origem e destino não podem ser iguais!!!</p>
                <IoClose
                  className="btn-close-error"
                  onClick={() => setAddressEqualError("")}
                ></IoClose>
              </div>
            )}
            {!result && (
              <input
                type="submit"
                value="Estimar Rota"
                disabled={!isFormValid()}
              ></input>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchRideForm;
