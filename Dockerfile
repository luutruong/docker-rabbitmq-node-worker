ARG BASE_IMAGE=node:18.16-alpine

FROM $BASE_IMAGE AS deps

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

FROM $BASE_IMAGE AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build
RUN npm prune --production

FROM $BASE_IMAGE AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV production
EXPOSE 3000

CMD ["yarn", "start"]
