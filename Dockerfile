FROM node:16

RUN npm install -g sails@1.5.8

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 1337

CMD sails lift --port 1337