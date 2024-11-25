import React from "react";
import "./Trips.css";
import { useState } from "react";

//Utils 
import { convert } from "../utils/convertDate";

//Interfaces
import { Trip } from "../interfaces/trip.interface";
import { responseSearchTrips } from "../interfaces/trip.interface";

//Services
import { searchTrips } from "../services/tripService";

//Mascara para o input
import InputMask from "react-input-mask";

//Validator de cpf
import { cpf } from "cpf-cnpj-validator";

const Trips = () => {
  const [cpfValue, setCpfValue] = useState<string>("");
  const [idDriver, setIdDriver] = useState<number>(0);
  const [errorCpf, setErrorCpf] = useState<string>("");
  const [errorIdDriver, setErrorIdDriver] = useState<string>("");
  const [data, setData] = useState<Array<Trip>>([]);

  const handleCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: string = e.target.value;

    // Remove formatação para validação
    const stripped: string = cpf.strip(input);

    setCpfValue(stripped);
    if (stripped.length === 11 && stripped && !cpf.isValid(stripped)) {
      setErrorCpf("CPF inválido");
    } else {
      setErrorCpf("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response:responseSearchTrips = await searchTrips({
      customer_id: cpfValue,
      driver_id: idDriver,
    });
    if (response.error_code) {
      return setErrorIdDriver("Motorista Invalido!!!");
    }
    setErrorIdDriver("");
    setData(response.rides);
  };

  const isFormValid = () => {
    const isCpfValid = errorCpf === ""; // Se não houver erro de CPF
    const isExistCpf = cpfValue !== ""; // Se o campo cpf não está vazio
    return isExistCpf && isCpfValid && cpfValue.length === 11;
  };
  return (
    <div className="trips">
      <div className="trips-container">
        <h3>Buscar Viagem</h3>
        <div className="form-filter">
          <form onSubmit={handleSubmit}>
            <label>
              <InputMask
                mask={"999.999.999-99"}
                value={cpfValue}
                name="cpf"
                placeholder="999.999.999-99"
                onChange={handleCPF}
              ></InputMask>
              {errorCpf && <p className="error-text">{errorCpf}</p>}
            </label>
            <label>
              <input
                type="number"
                value={idDriver}
                name="idDriver"
                placeholder="Digite o ID do motorista"
                onChange={(e) => setIdDriver(Number(e.target.value))}
              />
              {errorIdDriver && <p className="error-text">{errorIdDriver}</p>}
            </label>
            <input
              type="submit"
              value="Filtrar"
              className="btn-filter"
              disabled={!isFormValid()}
            />
          </form>
        </div>
        <table>
          <thead>
            <tr>
              <th>Motorista</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Distância</th>
              <th>Tempo</th>
              <th>Valor R$</th>
              <th>Data e Hora</th>
            </tr>
          </thead>
          <tbody>
            {data.map((trip) => (
              <tr>
                <td>{trip.driver.name}</td>
                <td>{trip.origin}</td>
                <td>{trip.destination}</td>
                <td>{trip.distance} km</td>
                <td>{trip.duration} </td>
                <td>{trip.value} </td>
                {trip.createdAt && (<td>{convert(trip.createdAt)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;
