FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npx tsc -p tsconfig.json

EXPOSE 3000

CMD ["node", "dist/server.js"]