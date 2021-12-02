import express from 'express'
import PublishController from '../controllers/api/PublishController'

const router = express.Router()

router.post('/publish', PublishController.index)

export default router
