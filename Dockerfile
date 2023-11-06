# FROM node:16.13.1-alpine as builder

# ENV NODE_ENV build

# USER node
# WORKDIR /home/node

# COPY package.json package.json
# COPY yarn.lock yarn.lock

# RUN yarn install \
#     --prefer-offline \
#     --frozen-lockfile \
#     --non-interactive \
#     --production=false \
#     --ignore-script

# COPY --chown=node:node . .
# RUN yarn build

# RUN rm -rf node_modules && \
#     NODE_ENV=production yarn install \
#     --prefer-offline \
#     --pure-lockfile \
#     --non-interactive \
#     --production=true

# --- BUILD PROD 
# to generate dist/ folder : nest build

FROM node:16.13.1-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/c2pub

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY ./node_modules node_modules
COPY ./dist dist

ENV HOST 0.0.0.0
EXPOSE 8700

CMD ["node", "dist/src/main.js"]