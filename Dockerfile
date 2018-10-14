FROM node:8
RUN apt-get update && apt-get install -y vim
RUN npm i npm@latest -g
RUN npm install firebase-functions@latest firebase-admin@latest --save
RUN npm install -g firebase-tools