# latest official node image
FROM node:latest

MAINTAINER Thomas Nyambati <thomasnyambati@gmail.com>

# use nodemon for development
RUN npm install --global nodemon

# use cached layer for node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install > /dev/null 2>&1
RUN mkdir -p /usr/src && cp -a /tmp/node_modules /usr/src/

# add project files
WORKDIR /usr/src
ADD . /usr/src

EXPOSE 3000
RUN ls

CMD ["npm","start"]
