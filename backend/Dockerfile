FROM node:14

WORKDIR /teamproject/
COPY ./package.json /teamproject/
COPY ./yarn.lock /teamproject/
RUN yarn install


COPY . /teamproject/

CMD yarn start:dev