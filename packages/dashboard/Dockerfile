FROM node:16.3.0-alpine

WORKDIR /usr/app

COPY package.json .

ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn --no-lockfile

COPY public ./public
COPY src ./src
COPY styles ./styles
COPY next.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .

CMD ["sh", "-c", "env | grep -E 'NEXT_PUBLIC|KRATOS|STRIPE' > .env.local && yarn build && yarn start"]
