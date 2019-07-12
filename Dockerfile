FROM node:11.9.0-alpine as builder
RUN apk update
RUN apk add --update bash

RUN apk add git
RUN npm install -g --unsafe-perm polymer-cli
RUN npm install -g typescript

ADD . /code/
WORKDIR /code
RUN npm i
RUN npm run build

FROM node:11.9.0-alpine
RUN apk update
RUN apk add --update bash

WORKDIR /code
RUN npm install express --no-save
RUN npm install browser-capabilities@1.1.3 --no-save
COPY --from=builder /code/express.js /code/express.js
COPY --from=builder /code/build /code/build
EXPOSE 8080
CMD ["node", "express.js"]
