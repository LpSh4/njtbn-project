FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

#   ./certs/ryban.ru.crt
#   ./certs/ryban.ru.key
COPY certs/ryban.ru.crt /etc/nginx/certs/ryban.ru.crt
COPY certs/ryban.ru.key /etc/nginx/certs/ryban.ru.key
COPY certs/ca.crt /etc/nginx/certs/ca.crt

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]