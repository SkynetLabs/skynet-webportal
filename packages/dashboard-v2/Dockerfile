FROM node:16.14.2-alpine

WORKDIR /usr/app

COPY packages/dashboard-v2/package.json \
     packages/dashboard-v2/yarn.lock \
     ./

RUN yarn --frozen-lockfile

COPY packages/dashboard-v2/static ./static
COPY packages/dashboard-v2/src ./src
COPY packages/dashboard-v2/gatsby*.js \
     packages/dashboard-v2/postcss.config.js \
     packages/dashboard-v2/tailwind.config.js \
     ./

CMD ["sh", "-c", "yarn build && yarn serve --host 0.0.0.0 -p 9000"]
