FROM node:18-alpine AS builder
WORKDIR /app
COPY .env /app/.env
COPY ./frontend /app
RUN node ./scripts/copy-env.js
RUN npm install
RUN npm run build --omit=dev

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

