FROM node:23-bookworm-slim

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["node", "server.js"]