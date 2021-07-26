FROM node:16.5.0-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn

COPY public ./public
COPY src ./src
COPY styles ./styles
COPY next.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .

CMD ["sh", "-c", "env | grep -E 'NEXT_PUBLIC|KRATOS|STRIPE' > .env.local && yarn build && yarn start"]
