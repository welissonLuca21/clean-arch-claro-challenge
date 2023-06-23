import { errorHandler, requestLogger } from '@/api/rest/middlewares'
import 'express-async-errors'
import express, { Express } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import router from '@/api/rest/routes'

export const setupRest = (app: Express) => {
  app.use(helmet())
  app.use(cors())

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json({ limit: '50mb' }))

  app.use(requestLogger)

  app.use('/api', router)
  app.use(errorHandler)
}
