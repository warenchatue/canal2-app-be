# --- BUILD PROD 
# to generate dist/ folder : nest build

FROM node:16.13.1-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/dinoes

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY ./node_modules node_modules
COPY ./dist dist

ENV HOST 0.0.0.0
EXPOSE 8700

CMD ["node", "dist/src/main.js"]