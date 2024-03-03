FROM node:21-alpine
LABEL authors="kalee"

WORKDIR /app
COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "start"]