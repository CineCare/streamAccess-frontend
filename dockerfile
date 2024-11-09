FROM node

RUN npm install
RUN npm run build

FROM staticdeploy/app-server:vX.Y.Z

COPY --from=0 /dist /build