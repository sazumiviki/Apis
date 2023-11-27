FROM node:latest

RUN apt-get update && \
    apt-get install -y libnss3 libx11-xcb1 libxcb1 libxcomposite1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxss1 libxtst6

WORKDIR /app

COPY package.json .

RUN npm install

# Install Chromium
RUN apt-get install -y chromium

COPY . .

EXPOSE 7860

CMD ["node", "index.js"]
