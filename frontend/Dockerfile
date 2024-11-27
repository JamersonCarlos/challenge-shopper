# Usa uma imagem base do Node.js
FROM node:18-alpine AS builder

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o arquivo .env para o diretório do frontend
COPY .env /app/.env

# Copia o restante dos arquivos do frontend
COPY ./frontend /app

# Executa script para trocar o nome da variável de ambiente 
RUN node ./scripts/copy-env.js
# Instala as dependências e realiza o build
RUN npm install
RUN npm run build --omit=dev

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

