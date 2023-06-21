import { Authenticate } from '@/domain/services/authenticate'
import { STATUS_CODE } from '@/constants/status-codes'
import { Router } from 'express'
import Container from 'typedi'
import { asyncHandler } from '@/api/rest/middlewares/async-handlers'

const authService = Container.get(Authenticate)

export class AuthenticationRoutes {
  private readonly _router = Router()

  constructor() {
    this._router.post('/login', asyncHandler(this.login))
  }

  get router() {
    return this._router
  }

  login = async (req, res) => {
    const { email, password } = req.body
    const result = await authService.execute({ email, password })
    return res.status(STATUS_CODE.OK).json(result)
  }
}
