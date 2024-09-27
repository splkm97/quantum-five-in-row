FROM node:21-alpine AS builder
LABEL authors="kalee"

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM node:21-alpine
WORKDIR /app

RUN mkdir build
COPY --from=builder /app/build ./build
RUN npm install -g serve

EXPOSE 3000

ENTRYPOINT ["serve", "-s", "build"]