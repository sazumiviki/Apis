FROM node:latest

RUN apt-get update && \
    apt-get install -y libnss3

WORKDIR /app

COPY package.json .

RUN npm install

RUN apt-get install -y wget && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable

COPY . .

EXPOSE 7860

CMD ["node", "index.js"]
