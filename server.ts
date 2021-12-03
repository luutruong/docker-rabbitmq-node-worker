import express, {Request, Response} from 'express'
import {setupWorker} from './lib/amqp'
import http from 'http'
import {log} from './lib/helpers'
import ApiRoutes from './lib/routes/api'

const app = express()
const PORT = process.env.PORT || 3000
const queue = process.env.RABBITMQ_QUEUE as string

const server = http.createServer(app)

setupWorker(
  {
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
    hostname: process.env.RABBITMQ_HOSTNAME,
    port: parseInt(process.env.RABBITMQ_SOCKET_PORT as string, 10) || 5672,
  },
  {
    queue,
  }
)

app.use(express.json({strict: true}))

app.use((req: Request, res: Response, next: () => void) => {
  app.set('APP_START', Date.now())

  if (req.url.startsWith('/api')) {
    const apiKey = req.headers['x-api-key']
    if (!apiKey || apiKey !== process.env.API_KEY) {
      res.status(403).json({
        status: 'error',
        message: 'invalid api key',
      })

      return
    }
  }

  next()
})

app.use('/api', ApiRoutes)

server.listen(PORT, () => {
  log(`> App started at: http://localhost:${PORT}`)
})
