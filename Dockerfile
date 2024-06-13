FROM node:18.19.0
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./dist /usr/src/app/dist
COPY ./swagger-output.json /usr/src/app/swagger-output.json

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]