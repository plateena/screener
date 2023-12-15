FROM node:14

WORKDIR /app

COPY ./src/app ./

RUN npm install

CMD ["node", "app.js"]
