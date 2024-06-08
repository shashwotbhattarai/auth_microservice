FROM node:18.19.0
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./src /usr/src/app
RUN npm run build
COPY ./swagger-output.json /usr/src/app/swagger-output.json

EXPOSE 3001

CMD [ "npm","run", "start" ]