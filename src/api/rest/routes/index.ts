import { STATUS_CODE } from '@/constants/status-codes'
import { Router } from 'express'
import { AuthenticationRoutes } from './auth'
import { UserRoutes } from './user'
import { authorizeMiddleware } from '../middlewares/authorize'
import { DevicesRoutes } from './devices'

const router = Router()

router.get('/', (_, res) => {
  res.status(STATUS_CODE.OK).send('API Running!')
})

router.use('/auth', new AuthenticationRoutes().getRouter)
router.use('/user', new UserRoutes().getRouter)
router.use('/devices', authorizeMiddleware, new DevicesRoutes().getRouter)

export default router
