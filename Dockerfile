FROM node:16-buster-slim

WORKDIR /usr/src/app

ENV PRODUCTION=true
ENV PORT=3000

# Install deps
RUN npm i -g ts-node
COPY package.json ./
RUN npm i

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
