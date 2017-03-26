# latest official node image
FROM node:boron

MAINTAINER Thomas Nyambati <thomasnyambati@gmail.com>

# use nodemon for development
RUN npm install --global nodemon

# add project files
WORKDIR /usr/src
ADD . /usr/src
COPY scripts/init.sh /usr/src

EXPOSE 3000

CMD ["npm", "start"]
