FROM node:latest

RUN apt-get update && \
    apt-get install -y libnss3

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 7860

CMD ["node", "index.js"]
