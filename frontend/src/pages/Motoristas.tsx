import React, { useEffect, useState } from "react";
import "./Motoristas.css";
import { listDrivers } from "../services/driverService";
import { Driver } from "../interfaces/driver.interface";

const Motoristas: React.FC = () => {
  const [nameDriver, setNameDriver] = useState<string>("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverFilter, setDriverFilter] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await listDrivers();
        if (data) {
          setDrivers(data);
          setDriverFilter(data);
        }
      } catch (error) {
        console.error("Erro ao buscar motoristas:", error);
      }
    };

    fetchDrivers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameDriver(e.target.value);
  };

  return (
    <div className="drivers">
      <div className="drivers-container">
        <h3>Buscar Motorista</h3>
        <form className="search-form">
          <label>
            <input
              type="text"
              placeholder="Digite o nome do motorista"
              onChange={handleInputChange}
              value={nameDriver}
            />
          </label>
        </form>
                    Quilometragem Miníma:{" "}
                  </strong>{" "}
                  {driver.minKm} km
                </p>
                <p>
                  <strong className="emphasis-text">Valor por KM:</strong>R$
                  {driver.ratePerKm.toFixed(2)}
                </p>
                <p>
                  <strong className="emphasis-text">Veiculo:</strong>
                  {driver.vehicle}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Motoristas;
