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
