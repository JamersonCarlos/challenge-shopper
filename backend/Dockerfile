
FROM node:latest
WORKDIR /app
COPY .env /app/.env
COPY ./backend /app
COPY ./backend/entrypoint.sh /app/entrypoint.sh
RUN npm install
RUN chmod +x /app/entrypoint.sh

# Remove os caracteres especiais d
RUN sed -i 's/\r$//' /app/entrypoint.sh
EXPOSE 8080
# Usa o entrypoint.sh para executar as migrations e iniciar o backend
ENTRYPOINT [ "/bin/sh", "/app/entrypoint.sh" ]
CMD ["npm", "start"]