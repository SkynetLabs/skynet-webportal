FROM node:16.14.2-alpine

WORKDIR /usr/app

COPY packages/dashboard-v2/package.json packages/dashboard-v2/yarn.lock ./

RUN yarn --frozen-lockfile

COPY packages/dashboard/static ./static
COPY packages/dashboard/src ./src
COPY packages/dashboard/gatsby*.js ./
COPY packages/dashboard/postcss.config.js \
     packages/dashboard/tailwind.config.js \
     ./

CMD ["sh", "-c", "yarn build && yarn serve --host 0.0.0.0 -p 9000"]
