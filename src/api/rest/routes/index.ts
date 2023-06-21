import { STATUS_CODE } from '@/constants/status-codes'
import { Router } from 'express'
import { AuthenticationRoutes } from './auth'
import { UserRoutes } from './user'

const router = Router()

router.get('/', (_, res) => {
  res.status(STATUS_CODE.OK).send('API Running!')
})

router.use('/auth', new AuthenticationRoutes().router)
router.use('/user', new UserRoutes().router)

export default router
