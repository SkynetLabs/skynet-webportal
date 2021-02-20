FROM node:15.8.0-alpine

WORKDIR /usr/app

COPY package.json .

ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn --no-lockfile

COPY public ./public
COPY src ./src
COPY styles ./styles
COPY postcss.config.js .
COPY tailwind.config.js .

CMD ["sh", "-c", "env | grep -E 'NEXT_PUBLIC|KRATOS' > .env.local && yarn build && yarn start"]
