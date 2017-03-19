FROM node:latest

WORKDIR /usr/www

COPY server /usr/www/server
COPY tests /usr/www/tests
COPY index.js /usr/www
COPY package.json /usr/www

COPY scripts/test.sh /usr/www
RUN chmod 0755 test.sh

EXPOSE 3000

ENTRYPOINT [ "./test.sh", "npm run test"]
