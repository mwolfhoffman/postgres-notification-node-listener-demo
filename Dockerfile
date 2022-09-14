

FROM node:16-alpine

WORKDIR /

COPY package*.json ./
COPY yarn.lock ./

RUN npm install

COPY . ./

ENV PORT=8080

CMD [ "npm", "start" ]