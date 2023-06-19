FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install

COPY . .
RUN npm run build:server

CMD [ "npm", "run", "start" ]
