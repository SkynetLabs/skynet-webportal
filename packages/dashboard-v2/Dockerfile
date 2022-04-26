FROM node:16.14.2-alpine

WORKDIR /usr/app

COPY package.json \
     yarn.lock \
     ./

RUN yarn --frozen-lockfile

COPY static ./static
COPY src ./src
COPY gatsby*.js \
     postcss.config.js \
     tailwind.config.js \
     ./

CMD ["sh", "-c", "yarn build && yarn serve --host 0.0.0.0 -p 9000"]
