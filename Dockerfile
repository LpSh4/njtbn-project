FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY /certs/fullchain.crt /etc/nginx/certs/fullchain.crt
COPY /certs/certificate.key /etc/nginx/certs/certificate.key

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]