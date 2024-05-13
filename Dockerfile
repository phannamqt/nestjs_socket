FROM node:lts AS dist
COPY package.json ./

RUN yarn install

COPY . ./

ARG CI=false

RUN yarn build || true
FROM node:lts

ARG PORT=7000

RUN yarn global add pm2

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/dist
COPY --from=dist node_modules /usr/src/app/node_modules

COPY . /usr/src/app

EXPOSE $PORT

CMD ["pm2-runtime", "start", "dist/main.js", "-i", "5"]

#  CMD ["tail", "-f", "/dev/null"]
