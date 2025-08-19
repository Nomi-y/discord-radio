FROM node:18-alpine

RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

ENV NODE_ENV=development
ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "run", "dev"]
