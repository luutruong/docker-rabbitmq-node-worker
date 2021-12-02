import axios from 'axios'
import {Request, Response} from 'express'
import {ApiPublishBody} from '../../..'
import {isValidUrl, log} from '../../helpers'

class PublishController {
  public static index(req: Request, res: Response): void {
    const payload: ApiPublishBody = req.body
    if (!payload.url) {
      PublishController.jsonError(res, 'missing `url` field')
      return
    }
    if (typeof payload.url !== 'string' || !isValidUrl(payload.url)) {
      PublishController.jsonError(res, '`url` must be URL')
      return
    }

    const vhost = process.env.RABBITMQ_VHOST || '%2F'
    const exchange = process.env.RABBITMQ_EXCHANGE as string
    const routingKey = process.env.RABBITMQ_ROUTING_KEY as string
    const rabbitmqUrl = process.env.RABBITMQ_URL as string

    const bodyJson = JSON.stringify({
      routing_key: routingKey,
      payload: payload.url,
      payload_encoding: 'string',
      properties: {
        headers: {
          'x-delay': payload.delay_ms ? parseInt(payload.delay_ms as string, 10) : 0,
        },
      },
    })

    axios
      .post(`http://${rabbitmqUrl}/api/exchanges/${vhost}/${exchange}/publish`, bodyJson, {
        auth: {
          username: process.env.RABBITMQ_USER as string,
          password: process.env.RABBITMQ_PASSWORD as string,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((rabbitmqRes) => log(rabbitmqRes.data))
      .then(() => {
        res.status(200).json({
          status: 'ok',
          message: 'ok',
          timing: (Date.now() - res.app.get('APP_START')) / 1000,
        })
      })
      .catch((err: any) => {
        log(err.toString())
        PublishController.jsonError(res, 'publish item error')
      })
  }

  public static jsonError(res: Response, message: string, status = 400): void {
    res.status(status).json({
      status: 'error',
      message,
      timing: (Date.now() - res.app.get('APP_START')) / 1000,
    })
  }
}

export default PublishController
