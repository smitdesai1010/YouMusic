FROM node:14.15.3-slim

WORKDIR /YouMusicDocker

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node" , "app.js"]

#docker build ./ -t "youmusic"
#docker build -t "youmusic" .