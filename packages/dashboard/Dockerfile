FROM node:14.15.0-alpine

WORKDIR /usr/app

COPY public ./public
COPY src ./src
COPY styles ./styles
COPY package.json .
COPY postcss.config.js .
COPY tailwind.config.js .

ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn --no-lockfile && yarn build
CMD ["yarn", "start"]
