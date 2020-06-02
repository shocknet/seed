FROM node:10-alpine

WORKDIR /usr/src/app

ENV PRODUCTION=true
ENV PORT=3000

# Install deps
RUN npm i -g ts-node
COPY package.json yarn.lock ./
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make
RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]