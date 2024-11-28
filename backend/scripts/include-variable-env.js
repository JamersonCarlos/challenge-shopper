const fs = require("fs");
const path = require("path");

// Caminhos para os arquivos .env
const parentEnvPath = path.resolve(__dirname, "../.env");
const backendEnvPath = path.resolve(__dirname, ".env");

// Nome da variável a ser copiada
const targetVariable = "GOOGLE_API_KEY";

function copyEnvVariable(sourcePath, destinationPath, variable) {
  try {
    // Verifica se o arquivo de origem existe
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Arquivo .env não encontrado em: ${sourcePath}`);
    }

    // Lê o conteúdo do arquivo de origem
    const sourceContent = fs.readFileSync(sourcePath, "utf-8");

    // Busca pela variável alvo no conteúdo do arquivo
    const variableLine = sourceContent
      .split("\n")
      .find((line) => line.startsWith(`${variable}=`));

    if (!variableLine) {
      throw new Error(`Variável ${variable} não encontrada no arquivo .env`);
    }

    // Garante que o arquivo de destino existe, ou cria um novo
    if (!fs.existsSync(destinationPath)) {
      fs.writeFileSync(destinationPath, ""); // Cria um arquivo vazio
    }

    // Lê o conteúdo do arquivo de destino
    const destContent = fs.readFileSync(destinationPath, "utf-8");

    // Atualiza ou adiciona a variável no arquivo de destino
    const updatedDestContent = destContent
      .split("\n")
      .filter((line) => !line.startsWith(`${variable}=`)) // Remove a variável, se já existir
      .concat(variableLine) // Adiciona a nova linha com a variável
      .join("\n");

    // Salva o conteúdo atualizado no arquivo de destino
    fs.writeFileSync(destinationPath, updatedDestContent.trim() + "\n");
    console.log(`Variável ${variable} adicionada/atualizada em: ${destinationPath}`);
  } catch (error) {
    console.error(`Erro ao processar variável ${variable}:`, error.message);
    process.exit(1);
  }
}

// Executa a cópia da variável
copyEnvVariable(parentEnvPath, backendEnvPath, targetVariable);