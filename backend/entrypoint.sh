#!/bin/sh

# Espera até que o banco de dados esteja disponível
echo "Aguardando o banco de dados..."
until nc -z -v -w30 $DB_HOST $DB_PORT; do
  echo "Aguardando o banco de dados... ($DB_HOST:$DB_PORT)"
  sleep 5
done

# Executa as migrations
echo "Executando as migrations..."
npx sequelize-cli db:migrate

# Executaa as seed
echo "Executando as seedrs"
npx sequelize-cli db:seed:all

# Inicia o servidor
echo "Iniciando o backend..."
exec "$@"  # Executa o comando original que foi passado para o script (ex: npm start)
