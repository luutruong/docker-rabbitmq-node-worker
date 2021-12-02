# Docker RabbitMQ Worker (Nodejs)

A worker for rabbitmq.

## Installation

From source:

```bash
docker build -f Dockerfile -t rabbitmq-docker .
```

## Running

```bash
docker run -d --name rabbitmq-docker \
  -e RABBITMQ_EXCHANGE='rabbitmq-exchange' \
  -e RABBITMQ_ROUTING_KEY='rabbitmq-routingkey' \
  -e RABBITMQ_VHOST='%2F' \
  -e RABBITMQ_URL='http://localhost:15672' \
  -e RABBITMQ_QUEUE='rabbitmq-queue' \
  -e RABBITMQ_USER='rabbitmq-user' \
  -e RABBITMQ_PASSWORD='rabbitmq-pass' \
  -p 3000:3000 \
  rabbitmq-docker
```

## API

### POST `/api/publish`

```bash
curl -X POST -d '{"url":"https://foo.baz","delay_ms":60000}' 
  -H 'Content-Type: application/json' \
  \ http://localhost:3000/api/publish
```
