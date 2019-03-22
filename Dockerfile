# FROM node:8-alpine
# RUN apk update

# RUN apk add --update bash

# RUN apk add git
# RUN npm i -g npm@5.6.0
# RUN npm install -g --unsafe-perm polymer-cli gulp-cli

# ENV NODE_OPTIONS --max-old-space-size=3072
# WORKDIR /code
# ADD package.json /code/

# RUN npm install
# # RUN bower --allow-root install

# RUN mkdir /code/
# ADD . /code/
# WORKDIR /code
# RUN cp -a /tmp/node_modules /code/node_modules
# RUN npm run build
# EXPOSE 8080
# # ENV PATH="/code/node_modules/.bin:${PATH}"
# # CMD ["npm", "run", "start"]
# RUN gulp
# CMD ["node" "express.js"]

FROM node:8-alpine
RUN apk update

RUN apk add --update bash

RUN npm i -g npm@5.6.0
RUN npm install -g --unsafe-perm polymer-cli

ENV NODE_OPTIONS --max-old-space-size=3072
WORKDIR /tmp
COPY package.json /tmp/

RUN npm install

RUN mkdir /code/
COPY /src/ /code/
WORKDIR /code
RUN cp -a /tmp/node_modules /code/node_modules
RUN npm run build
EXPOSE 8080
CMD npm run start
