ARG BASE_IMAGE=node:16.11-alpine

FROM $BASE_IMAGE AS deps

WORKDIR /app

COPY worker/package.json .
COPY worker/yarn.lock .

RUN yarn install

FROM $BASE_IMAGE AS builder

WORKDIR /app

COPY ./worker .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

FROM $BASE_IMAGE AS runner

WORKDIR /app

COPY --from=builder /app/dist ./worker/dist
COPY --from=builder /app/node_modules ./worker/node_modules
COPY --from=builder /app/package.json ./worker/package.json

ENV NODE_ENV production

CMD ["yarn", "start"]