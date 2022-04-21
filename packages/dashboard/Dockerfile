FROM node:16.14.2-alpine

WORKDIR /usr/app

COPY packages/dashboard/package.json \
     packages/dashboard/yarn.lock \
     ./

ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn --frozen-lockfile

COPY packages/dashboard/public ./public
COPY packages/dashboard/src ./src
COPY packages/dashboard/styles ./styles
COPY packages/dashboard/.eslintrc.json \
     packages/dashboard/postcss.config.js \
     packages/dashboard/tailwind.config.js \
     ./

CMD ["sh", "-c", "env | grep -E 'NEXT_PUBLIC|STRIPE|ACCOUNTS' > .env.local && yarn build && yarn start"]
