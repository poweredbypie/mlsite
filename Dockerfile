FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

CMD [ "npm", "run", "start" ]
