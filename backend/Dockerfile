
FROM node:latest
WORKDIR /app
COPY .env /app/.env
COPY ./backend /app
COPY ./backend/entrypoint.sh /app/entrypoint.sh
RUN npm install

# Instalando netcat para verificação da conexão com o banco
RUN apt-get update && apt-get install -y netcat-openbsd

RUN chmod +x /app/entrypoint.sh

# Remove os caracteres especiais 
RUN sed -i 's/\r$//' /app/entrypoint.sh
EXPOSE 8080
# Usa o entrypoint.sh para executar as migrations e iniciar o backend
ENTRYPOINT [ "/bin/sh", "/app/entrypoint.sh" ]
CMD ["npm", "start"]