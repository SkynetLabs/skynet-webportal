FROM node:16.8.0-alpine

WORKDIR /usr/app

COPY package.json yarn.lock ./

ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn --frozen-lockfile

COPY public ./public
COPY src ./src
COPY styles ./styles
COPY next.config.js postcss.config.js tailwind.config.js ./

CMD ["sh", "-c", "env | grep -E 'NEXT_PUBLIC|KRATOS|STRIPE' > .env.local && yarn build && yarn start"]
