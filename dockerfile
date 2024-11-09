FROM node

RUN npm install --global @staticdeploy/app-server

COPY dist .

CMD ["app-server"]