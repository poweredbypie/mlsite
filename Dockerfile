FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock .
RUN yarn

COPY . .
RUN yarn build

CMD [ "yarn", "start" ]
