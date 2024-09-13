FROM node:20.10-alpine as builder

ENV NODE_ENV build
USER node
WORKDIR /home/dinoes-be
COPY . .
RUN rm -rf node_modules
RUN yarn install
COPY --chown=node:node . .
RUN yarn build
ENV HOST 0.0.0.0
EXPOSE 8700

CMD ["node", "dist/src/main.js"]