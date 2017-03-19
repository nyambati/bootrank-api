FROM node:latest

WORKDIR /usr/src
ADD . /usr/src

COPY scripts/test.sh /usr/www
RUN chmod 0755 test.sh

EXPOSE 3000

ENTRYPOINT [ "./test.sh", "npm run test"]
