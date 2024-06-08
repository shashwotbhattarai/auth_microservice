FROM node:18.19.0
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./src /usr/src/app/src
RUN npm run build

EXPOSE 3001

CMD [ "node", "./dist/index.js" ]