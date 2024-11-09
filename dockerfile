FROM node

WORKDIR /usr/app

COPY package*.json .

RUN npm install
RUN npm run build

FROM staticdeploy/app-server:v4.1.0

COPY --from=0 /dist /build