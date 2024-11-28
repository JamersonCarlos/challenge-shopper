# Usa uma imagem base do Node.js
FROM node:latest

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o arquivo .env para o diretório do backend
COPY .env /app/.env

# Copia o restante dos arquivos do backend
COPY ./backend /app

# Copia o script de entrypoint
COPY ./backend/entrypoint.sh /app/entrypoint.sh

# Instala as dependências
RUN npm install

RUN chmod +x /app/entrypoint.sh

RUN sed -i 's/\r$//' /app/entrypoint.sh

# Expõe a porta usada pelo backend
EXPOSE 8080

# Usa o entrypoint.sh para executar as migrations e iniciar o backend
ENTRYPOINT [ "/bin/sh", "/app/entrypoint.sh" ]
CMD ["npm", "start"]