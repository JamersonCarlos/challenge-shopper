const shell = require("shelljs");
const fs = require("fs");
const path = require("path");

// Copia o .env da raiz para o diretório do frontend
if (shell.cp("../.env", ".env").code !== 0) {
  console.error("Erro ao copiar o arquivo .env");
  process.exit(1);
}

// Caminhos para o arquivo .env
const sourcePath = path.resolve(__dirname, "../.env");

// Nome da variável a ser renomeada
const targetVariable = "GOOGLE_API_KEY";
const newPrefix = "REACT_APP_";

// Verifica se o arquivo .env original existe
if (!fs.existsSync(sourcePath)) {
  console.error(`Arquivo .env não encontrado em: ${sourcePath}`);
  process.exit(1);
}

try {
  // Lê o conteúdo do arquivo .env original
  const envContent = fs.readFileSync(sourcePath, "utf-8");

  // Processa cada linha e renomeia a variável alvo
  const updatedEnv = envContent
    .split("\n")
    .map((line) => {
      if (line.startsWith(`${targetVariable}=`)) {
        // Renomeia a variável com o novo prefixo
        const [key, value] = line.split("=");
        return `${newPrefix}${key}=${value}`;
      }
      return line; // Retorna as outras linhas inalteradas
    })
    .join("\n");
    fs.writeFileSync(sourcePath, updatedEnv);
} catch (error) {
  console.error("Erro ao renomear a variável no arquivo .env:", error.message);
  process.exit(1);
}

