import axios from 'axios'
import amqp, {Channel, Connection, Message, Options} from 'amqplib/callback_api'
import {log} from './helpers'
import {WorkerOptions} from '..'

export function setupWorker(connectOptions: Options.Connect, options: WorkerOptions) {
  amqp.connect(connectOptions, function (err: any, connection: Connection) {
    if (err) {
      throw err
    }

    log('connected to rabbitmq')
    connection.createChannel(function (err1: any, channel: Channel) {
      if (err1) {
        throw err1
      }

      channel.assertQueue(options.queue, {
        durable: true,
        messageTtl: 86400000,
      })

      channel.prefetch(1)
      channel.consume(
        options.queue,
        async function (msg: Message | null) {
          if (!msg) {
            return
          }

          const url = msg.content.toString()
          log('received message', url)
          if (url.length <= 0) {
            return
          }
          const timeStart = Date.now()

          try {
            const response = await axios.get(url, {
              validateStatus: function (status: number) {
                return status >= 200 && status < 400
              },
            })

            log(
              'fetch OK',
              '\n  -->',
              {status: response.status, data: response.data},
              '\n  -->',
              'timing',
              `${Date.now() - timeStart}ms`
            )
          } catch (e: any) {
            log('-->', e.toString())
          }
        },
        {
          noAck: true,
        }
      )
    })
  })
}
