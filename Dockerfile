ARG BASE_IMAGE=node:16.11-alpine

FROM $BASE_IMAGE AS deps

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

FROM $BASE_IMAGE AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

FROM $BASE_IMAGE AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV production
EXPOSE 3000

CMD ["yarn", "start"]
