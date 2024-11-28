# Desafio da shopper
Este projeto é um aplicativo de táxi particular que consiste em um frontend desenvolvido com **React.js** e **TypeScript**, e um backend implementado com **Node.js**, **TypeScript**, e um banco de dados **MySQL**. O objetivo principal da aplicação é fornecer uma plataforma eficiente e amigável para que usuários possam solicitar corridas, gerenciar suas reservas e ter uma experiência de transporte personalizada e segura.

## Estrutura do Projeto
O projeto é dividido em duas partes principais:
- **Frontend**: a interface do usuário, desenvolvida com React.js e TypeScript.
- **Backend**: a API que gerencia a lógica de negócios e interage com o banco de dados MySQL, implementada com Node.js e TypeScript.

## Pré-requisitos
Antes de começar, certifique-se de que você tenha os seguintes programas instalados em sua máquina:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)
- [Docker](https://www.docker.com/) (para execução do MySQL em contêiner)
- [MySQL](https://www.mysql.com/) (localmente ou em contêiner Docker)


# Executando em ambiente local
## Configuração do Backend

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto/backend
``` 
### 2. Instalar depedências 
```bash
npm install
```
### 3. Configure as variáveis de ambiente
```bash
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=(name_database)
DB_USER=root
DB_PWD=(password_database)
GOOGLE_API_KEY=(Sua chave da API Google) 
```
### 4. Execute as migrations e seeds
```bash 
npm run setup
```

### 5. Inicie o servidor 
```bash
npm start
```

## Configuração do Frontend

### 1. Navegue para a pasta do frontend
```bash
cd ../frontend
```

### 2. Instale as dependências
```bash
npm install 
```

### 3. Configure as variáveis de ambiente
```bash
REACT_APP_API_URL=http://localhost:8080
GOOGLE_API_KEY=(Sua chave da API Google) 
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm start
```

# Executando com Docker-Compose
## Configuração da Chave referente ao Google Maps Api
Para execução e carregamento dos maps referentes a esse 
serviço externo é necessário incluir um arquivo .env na raiz do projeto 
no formato a seguir: 
```bash
GOOGLE_API_KEY=(Sua chave da API) 
```
Após essa configuração inicial é só executar o seguinte comando: 
```bash
docker-compose up
```
