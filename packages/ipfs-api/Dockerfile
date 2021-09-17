FROM node:16.9.0-alpine

WORKDIR /usr/app

# copy package configuration and install node modules
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# copy over source files
COPY src src
COPY tsconfig.json ./

# build application
ENV NODE_ENV production
RUN yarn build

EXPOSE 3100

CMD ["yarn", "start"]
