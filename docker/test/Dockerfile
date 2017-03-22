FROM node:latest
MAINTAINER Thomas Nyambati <thomasnyambati@gmail.com>

ADD package.json /tmp/package.json
RUN cd /tmp && npm install > /dev/null 2>&1
RUN mkdir -p /usr/src && cp -a /tmp/node_modules /usr/src/

# add project files
WORKDIR /usr/src
ADD . /usr/src

RUN npm install -g mocha

EXPOSE 3000

CMD ["npm", "test"]
