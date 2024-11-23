import React from "react";
import "./SearchRideForm.css";
import { FaIdCard, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { Autocomplete } from "@react-google-maps/api";

const SearchRideForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <span>CPF</span>
        <div className="input-container">
          <input
            type="text"
            name="cpf"
            placeholder="Ex: 12031405123"
            maxLength={11}
          />
          <FaIdCard className="icon-right" /> {/* Ícone React Icons */}
        </div>
      </label>

      <label>
        <span>Origem</span>
        <div className="input-container">
          <Autocomplete>
            <input type="text" name="origem" placeholder="Endereço de origem" />
          </Autocomplete>
          <FaMapMarkerAlt className="icon-right" /> {/* Ícone React Icons */}
        </div>
      </label>

      <label>
        <span>Destino</span>
        <div className="input-container">
          <Autocomplete>
            <input
              type="text"
              name="destino"
              placeholder="Endereço do destino"
            />
          </Autocomplete>
          <FaLocationArrow className="icon-right" /> {/* Ícone React Icons */}
        </div>
      </label>

      <input type="submit" value="Buscar" />
    </form>
  );
};

export default SearchRideForm;
