FROM node:16 as build
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY .env /app/.env
RUN yarn
COPY . /app
RUN yarn build

FROM node:16
WORKDIR /app
COPY --from=build /app/build /app
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/yarn.lock /app/yarn.lock
COPY --from=build /app/.env /app/.env
RUN yarn --production
EXPOSE 9800
CMD ["node", "/app/src/server.js"]