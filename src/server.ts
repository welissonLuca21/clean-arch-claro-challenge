import 'reflect-metadata'

import './config/module-alias'
import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

import env from '@/config/env'
import { setupRest } from './config/rest'

const app = express()

setupRest(app)

app.listen(env.PORT, () =>
  console.log(`Server running at: http://localhost:${env.PORT}`)
)
