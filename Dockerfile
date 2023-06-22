FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock .
COPY client/package.json client/
COPY server/package.json server/
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

CMD [ "yarn", "start" ]
