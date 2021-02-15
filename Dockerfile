FROM node:14.15.1-alpine3.12 as builder
RUN apk update
RUN apk add --update bash

RUN apk add git
RUN npm install -g --unsafe-perm polymer-cli
RUN npm install -g typescript

ADD . /code/
WORKDIR /code
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm i
RUN npm run build

FROM node:14.15.1-alpine3.12
RUN apk update
RUN apk add --update bash

WORKDIR /code
RUN npm install express --no-save
RUN npm install browser-capabilities@1.1.3 --no-save
COPY --from=builder /code/express.js /code/express.js
COPY --from=builder /code/build /code/build
EXPOSE 8080
CMD ["node", "express.js"]
