FROM node:latest

WORKDIR /usr/www

COPY server /usr/www/server
COPY index.js /usr/www
COPY package.json /usr/www

COPY scripts/init.sh /usr/www
RUN chmod 0755 init.sh

EXPOSE 3000

ENTRYPOINT [ "./init.sh", "npm start"]
